import { flatten, HttpService, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { Observable, EMPTY, Subject, from } from 'rxjs';
import { map, mergeMap, tap, bufferWhen } from 'rxjs/operators';

import { environment } from '../config/environment';
import { SpotifyPaging, SavedTrack, PlaylistTrack, LIKED_ID } from '../models/spotify.models';
import { SharedService } from './shared.service';

@Injectable()
export class LibraryService {

  constructor(
    private http: HttpService,
    private sharedService: SharedService
  ) { }

  getTracksToSave(request: Request, playlist: string): Observable<never> {
    const tracklist$: Observable<SpotifyPaging<PlaylistTrack | SavedTrack>> = playlist === LIKED_ID
      ? this.sharedService.getCompleteSavedTracklist(request, true)
      : this.sharedService.getCompleteTracklist(request, playlist, 50);
    return tracklist$.pipe(
      map(tracks => tracks.items.map(item => item.track.id)),
      map(ids => ({ ids: [...ids] })),
      mergeMap(tracklist => this.saveTracksByRequest(request, true, tracklist))
    );
  }

  saveTracksByRequest(request: Request, complete?: boolean, tracklist?: { ids: string[] }): Observable<never> {
    return this.http.put<never>(
      `${environment.apiBaseUrl}/me/tracks`,
      complete ? tracklist : JSON.stringify(this.formatTracksToSaveOrRemove(request.body)),
      { headers: SharedService.getAuthorizationHeader(request) }
    ).pipe(mergeMap(() => EMPTY));
  }

  getSavedTracksToRemove(request: Request): Observable<never> {
    const closingEvent: Subject<boolean> = new Subject<boolean>();
    return this.sharedService.getCompleteSavedTracklist(request, false).pipe(
      tap(tracks => SharedService.toggleClosingBuffer(tracks, closingEvent)),
      map(tracks => tracks.items.map(item => item.track.id)),
      bufferWhen(() => closingEvent.asObservable()),
      map(buffer => flatten(buffer)),
      map(uris => this.formatSavedTracksToRemoveAsChunks(uris)),
      mergeMap(tracklist => tracklist.pipe(
        mergeMap(list => this.removeSavedTracksByRequest(request, true, list))
      ))
    );
  }

  removeSavedTracksByRequest(
    request: Request,
    complete?: boolean,
    tracklist?: string[]
  ): Observable<never> {
    return this.http.delete<never>(
      `${environment.apiBaseUrl}/me/tracks`,
      {
        data: complete ? tracklist : JSON.stringify(request.body),
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(mergeMap(() => EMPTY));
  }

  formatSavedTracksToRemoveAsChunks(tracks: string[]): Observable<string[]> {
    const max = 50;
    return from(Array(Math.ceil(tracks.length / max))
      .fill(null)
      .map(() => tracks.splice(0, max), tracks.slice()));
  }

  formatTracksToSaveOrRemove(tracks: string[]): { ids: string[] } {
    return { ids: tracks };
  }

}
