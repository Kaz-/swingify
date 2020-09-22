import { Controller, Delete, Get, Logger, Put, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { expand, takeWhile, scan, map } from 'rxjs/operators';

import { SpotifyPaging, SavedTrack } from '../../models/spotify.models';
import { LibraryService } from '../../services/library.service';
import { SharedService } from '../../services/shared.service';

@Controller('library')
export class LibraryController {

  private logger = new Logger('Library Controller');

  constructor(
    private libraryService: LibraryService,
    private sharedService: SharedService
  ) { }

  @Get('tracks')
  getSavedTracks(@Req() request: Request): Observable<SpotifyPaging<SavedTrack>> {
    this.logger.log(`Requesting user's saved tracks`);
    return this.sharedService.getSavedTracksByRequest(request, false).pipe(
      expand(tracks => this.sharedService.getSavedTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(request.query.search) && Boolean(tracks.next), true),
      scan((prev, next) => ({ ...next, items: [...prev.items, ...next.items] })),
      map(tracks => request.query.search
        ? ({
          ...tracks,
          items: tracks.items.filter(item => SharedService.findMatchInTrack(item, request.query.search.toString().toLowerCase().trim())),
          next: null
        }) : tracks
      )
    );
  }

  @Put('tracks')
  saveTracks(@Req() request: Request): Observable<never> {
    this.logger.log('Saving tracks for user');
    return request.query.from
      ? this.libraryService.getTracksToSave(request, request.query.from.toString())
      : this.libraryService.saveTracksByRequest(request);
  }

  @Delete('tracks')
  removeSavedTracks(@Req() request: Request): Observable<never> {
    this.logger.log(`Removing tracks from saved tracks`);
    return request.query.from
      ? this.libraryService.getSavedTracksToRemove(request)
      : this.libraryService.removeSavedTracksByRequest(request);
  }

}
