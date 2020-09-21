import { flatten, HttpService, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { Observable, EMPTY, Subject, from } from 'rxjs';
import { map, mergeMap, tap, bufferWhen, expand, takeWhile } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { SpotifyPaging, SavedTrack, PlaylistTrack } from '../../models/spotify.models';
import { PlaylistsService } from '../playlists/playlists.service';
import { SharedService } from '../shared/shared.service';

@Injectable()
export class LibraryService {

  constructor(
    private http: HttpService,
    private playlistsService: PlaylistsService
  ) { }

  getSavedTracksByRequest(request: Request): Observable<SpotifyPaging<SavedTrack>> {
    return this.http.get<SpotifyPaging<SavedTrack>>(
      request.query.next
        ? Buffer.from(request.query.next.toString(), 'base64').toString()
        : `${environment.apiBaseUrl}/me/tracks?offset=0&limit=50`,
      { headers: SharedService.getAuthorizationHeader(request) }).pipe(map(response => response.data));
  }

  getSavedTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<SavedTrack>> {
    return this.http.get<SpotifyPaging<SavedTrack>>(next, { headers: authorization })
      .pipe(map(response => response.data));
  }

  getTracksToSave(request: Request, playlist: string): Observable<never> {
    const tracklist$: Observable<SpotifyPaging<PlaylistTrack | SavedTrack>> = playlist === 'liked'
      ? this.getCompleteSavedTracklist(request)
      : this.playlistsService.getCompleteTracklist(request, playlist, 50);
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
    return this.getCompleteSavedTracklist(request).pipe(
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

  getCompleteSavedTracklist(request: Request): Observable<SpotifyPaging<SavedTrack>> {
    return this.getSavedTracksByRequest(request).pipe(
      expand(tracks => this.getSavedTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(tracks.next), true)
    );
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
