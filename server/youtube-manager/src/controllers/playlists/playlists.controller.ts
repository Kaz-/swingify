import { Controller, Get, HttpService, Logger, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { expand, map, scan, takeWhile } from 'rxjs/operators';

import { environment } from '../../config/environment';

import { SharedService } from '../../services/shared.service';
import { PlaylistsService } from '../../services/playlists.service';
import { Details, PlaylistItem, PlaylistOverview, YoutubePaging } from '../../models/youtube.models';

@Controller('playlists')
export class PlaylistsController {

  private logger = new Logger('Playlists Controller');

  constructor(
    private http: HttpService,
    private playlistsService: PlaylistsService
  ) { }

  @Get()
  getPlaylists(@Req() request: Request): Observable<YoutubePaging<PlaylistOverview>> {
    this.logger.log(`Requesting playlists`);
    return this.http.get<YoutubePaging<PlaylistOverview>>(
      `${environment.apiBaseUrl}/playlists`,
      {
        params: { mine: true, part: 'snippet' },
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(map(response => response.data));
  }

  @Get(':id')
  getPlaylist(@Req() request: Request): Observable<Details<PlaylistOverview>> {
    this.logger.log(`Requesting playlist with ID: ${request.params.id}`);
    return this.http.get<YoutubePaging<PlaylistOverview>>(
      `${environment.apiBaseUrl}/playlists`,
      {
        params: { part: 'snippet', id: request.params.id },
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(map(response => response.data.items[0]));
  }

  @Get('/:id/tracks')
  getPlaylistTracks(@Req() request: Request): Observable<YoutubePaging<PlaylistItem>> {
    this.logger.log(`Requesting tracks from playlist: ${request.params.id}`);
    return this.playlistsService.getTracksByRequest(request).pipe(
      expand(tracks => this.playlistsService.getTracksByNext(tracks.nextPageToken, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(request.query.search) && Boolean(tracks.nextPageToken), true),
      scan((prev, next) => ({ ...next, items: [...prev.items, ...next.items] })),
      map(tracks => request.query.search
        ? ({
          ...tracks,
          items: tracks.items.filter(item => SharedService.findMatchInTrack(item.snippet, request.query.search.toString().toLowerCase().trim())),
          next: null
        }) : tracks
      )
    );
  }

}
