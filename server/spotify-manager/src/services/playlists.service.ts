import { flatten, HttpService, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EMPTY, from, Observable, Subject } from 'rxjs';
import { mergeMap, map, bufferWhen, tap } from 'rxjs/operators';

import { environment } from '../config/environment';
import { SpotifyPaging, PlaylistTrack, SavedTrack, LIKED_ID } from '../models/spotify.models';
import { SharedService } from './shared.service';

@Injectable()
export class PlaylistsService {

  constructor(
    private http: HttpService,
    public sharedService: SharedService
  ) { }

  getTracksToAdd(request: Request, playlist: string): Observable<never> {
    const tracklist$: Observable<SpotifyPaging<PlaylistTrack | SavedTrack>> = playlist === LIKED_ID
      ? this.sharedService.getCompleteSavedTracklist(request)
      : this.sharedService.getCompleteTracklist(request, playlist, 50);
    return tracklist$.pipe(
      map(tracks => tracks.items.map(item => item.track.uri)),
      map(uris => ({ uris: [...uris] })),
      mergeMap(tracklist => this.addTracksByRequest(request, true, tracklist))
    );
  }

  addTracksByRequest(request: Request, complete?: boolean, tracklist?: { uris: string[] }): Observable<never> {
    return this.http.post<never>(
      `${environment.apiBaseUrl}/playlists/${request.params.id}/tracks`,
      complete ? JSON.stringify(tracklist) : JSON.stringify(request.body),
      { headers: SharedService.getAuthorizationHeader(request) }
    ).pipe(mergeMap(() => EMPTY));
  }

  getTracksToRemove(request: Request, playlist: string): Observable<never> {
    const closingEvent: Subject<boolean> = new Subject<boolean>();
    return this.sharedService.getCompleteTracklist(request, playlist).pipe(
      tap(tracks => SharedService.toggleClosingBuffer(tracks, closingEvent)),
      map(tracks => tracks.items.map(item => item.track.uri)),
      bufferWhen(() => closingEvent.asObservable()),
      map(buffer => flatten(buffer)),
      map(uris => this.formatTracksToRemoveAsChunks(uris)),
      mergeMap(tracklist => tracklist.pipe(
        mergeMap(list => this.removeTracksByRequest(request, true, list))
      ))
    );
  }

  removeTracksByRequest(
    request: Request,
    complete?: boolean,
    tracklist?: { tracks: { uri: string }[] }
  ): Observable<never> {
    return this.http.delete<never>(
      `${environment.apiBaseUrl}/playlists/${request.params.id}/tracks`,
      {
        data: complete
          ? JSON.stringify(tracklist)
          : JSON.stringify(this.formatTracksToRemove(request.body)),
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(mergeMap(() => EMPTY));
  }

  formatTracksToRemoveAsChunks(tracks: string[]): Observable<{ tracks: { uri: string }[] }> {
    const max = 100;
    return from(Array(Math.ceil(tracks.length / max))
      .fill(null)
      .map(() => tracks.splice(0, max), tracks.slice())
      .map(tracks => ({ tracks: tracks.map(track => ({ uri: track })) })));
  }

  formatTracksToRemove(tracks: string[]): { tracks: { uri: string }[] } {
    return { tracks: tracks.map(track => ({ uri: track })) };
  }

}
