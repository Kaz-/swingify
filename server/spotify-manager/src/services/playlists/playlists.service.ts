import { flatten, HttpService, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { EMPTY, from, Observable, Subject } from 'rxjs';
import { mergeMap, map, expand, takeWhile, bufferWhen, tap } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { SpotifyPaging, PlaylistTrack } from '../../models/spotify.models';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class PlaylistsService {

  constructor(private http: HttpService) { }

  getTracksByRequest(request: Request, from?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(
      request.query.next
        ? Buffer.from(request.query.next.toString(), 'base64').toString()
        : `${environment.apiBaseUrl}/playlists/${from ? from : request.params.id}/tracks?offset=0&limit=100`,
      { headers: SharedService.getAuthorizationHeader(request) }).pipe(map(response => response.data));
  }

  getTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(next, { headers: authorization })
      .pipe(map(response => response.data));
  }

  getTracksToAdd(request: Request, playlist: string): Observable<never> {
    return this.getCompleteTracklist(request, playlist).pipe(
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
    return this.getCompleteTracklist(request, playlist).pipe(
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

  getCompleteTracklist(request: Request, from?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.getTracksByRequest(request, from).pipe(
      expand(tracks => this.getTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(tracks.next), true)
    );
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
