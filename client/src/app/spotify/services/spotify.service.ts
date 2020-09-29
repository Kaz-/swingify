import { Injectable, OnDestroy, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import {
  SpotifyUser,
  SpotifyPlaylist,
  SpotifyPaging,
  PlaylistCreation,
  PlaylistTrack,
  SpotifyFeaturedPlaylists,
  SavedTrack,
  LIKED_ID
} from '../models/spotify.models';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SpotifyAuthService } from '../../shared/services/spotify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService implements OnDestroy {

  private primaryUser: Subject<SpotifyUser> = new Subject<SpotifyUser>();
  private primaryPlaylists: Subject<SpotifyPaging<SpotifyPlaylist>> = new Subject<SpotifyPaging<SpotifyPlaylist>>();
  primaryUser$: Observable<SpotifyUser> = this.primaryUser.asObservable().pipe(shareReplay());
  primaryPlaylists$: Observable<SpotifyPaging<SpotifyPlaylist>> = this.primaryPlaylists.asObservable().pipe(shareReplay());

  private secondaryUser: Subject<SpotifyUser> = new Subject<SpotifyUser>();
  private secondaryPlaylists: Subject<SpotifyPaging<SpotifyPlaylist>> = new Subject<SpotifyPaging<SpotifyPlaylist>>();
  secondaryUser$: Observable<SpotifyUser> = this.secondaryUser.asObservable().pipe(shareReplay());
  secondaryPlaylists$: Observable<SpotifyPaging<SpotifyPlaylist>> = this.secondaryPlaylists.asObservable().pipe(shareReplay());

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.subscriptions.push(
      this.updateUser(false),
      this.updatePlaylists(false)
    );
  }

  static handleEmittedTracks<T>(
    prev: SpotifyPaging<T>,
    next: SpotifyPaging<T>
  ): SpotifyPaging<T> {
    return prev?.parentId === next?.parentId && next?.items.length > 0 && next?.fromNext
      ? { ...next, items: [...prev.items, ...next.items] } : next;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getUser(isSecondary: boolean): Observable<SpotifyUser> {
    return this.http.get<SpotifyUser>(
      `${environment.spotify.userPath}/me`,
      { headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  getPlaylists(isSecondary: boolean): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.http.get<SpotifyPaging<SpotifyPlaylist>>(
      environment.spotify.playlistsPath,
      { headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  updateUser(isSecondary: boolean): Subscription {
    return this.getUser(isSecondary)
      .subscribe(user => isSecondary ? this.secondaryUser.next(user) : this.primaryUser.next(user));
  }

  updatePlaylists(isSecondary: boolean): Subscription {
    return this.getPlaylists(isSecondary)
      .subscribe(playlists => isSecondary ? this.secondaryPlaylists.next(playlists) : this.primaryPlaylists.next(playlists));
  }

  getPlaylist(id: string, isSecondary: boolean): Observable<SpotifyPlaylist> {
    return this.http.get<SpotifyPlaylist>(
      `${environment.spotify.playlistsPath}/${id}`,
      { headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  getPlaylistTracks(id: string, isSecondary: boolean, next?: string, query?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(
      `${environment.spotify.playlistsPath}/${id}/tracks`,
      { params: this.createParams(next, query), headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  createPlaylist(userId: string, playlist: PlaylistCreation, isSecondary: boolean): Observable<SpotifyPlaylist> {
    return this.http.post<SpotifyPlaylist>(
      `${environment.spotify.playlistsPath}/create/${userId}`, playlist,
      { headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  addTracks(id: string, track: string[], from?: string): Observable<never> {
    return this.http.post<never>(
      `${environment.spotify.playlistsPath}/${id}`, track,
      {
        params: from ? new HttpParams().set('from', from) : null,
        headers: from === LIKED_ID ? this.setSecondaryHeader(true, true) : this.setSecondaryHeader(true)
      }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  removeTracks(id: string, track: string[], from?: string): Observable<ArrayBuffer> {
    return this.http.request<ArrayBuffer>('delete',
      `${environment.spotify.playlistsPath}/${id}`,
      {
        body: track,
        params: from ? new HttpParams().set('from', from) : null,
        headers: this.setSecondaryHeader(true)
      }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  getFeaturedPlaylists(): Observable<SpotifyFeaturedPlaylists> {
    return this.http.get<SpotifyFeaturedPlaylists>(
      `${environment.spotify.browsePath}/featured`,
      { params: new HttpParams().set('locale', this.locale), headers: this.setSecondaryHeader(false) }
    ).pipe(
      shareReplay(),
      catchError(err => this.errorService.handleError(err))
    );
  }

  getSavedTracks(isSecondary: boolean, next?: string, query?: string): Observable<SpotifyPaging<SavedTrack>> {
    return this.http.get<SpotifyPaging<SavedTrack>>(
      `${environment.spotify.libraryPath}/tracks`,
      { params: this.createParams(next, query), headers: this.setSecondaryHeader(isSecondary) }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  saveTracks(track: string[], from?: string): Observable<never> {
    return this.http.put<never>(
      `${environment.spotify.libraryPath}/tracks`, track,
      {
        params: from ? new HttpParams().set('from', from) : null,
        headers: from === LIKED_ID ? this.setSecondaryHeader(true, true) : this.setSecondaryHeader(true)
      }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  removeSavedTracks(track: string[], from?: string): Observable<ArrayBuffer> {
    return this.http.request<ArrayBuffer>('delete',
      `${environment.spotify.libraryPath}/tracks`,
      {
        body: track,
        params: from ? new HttpParams().set('from', from) : null,
        headers: this.setSecondaryHeader(true)
      }
    ).pipe(catchError(err => this.errorService.handleError(err)));
  }

  private createParams(next?: string, query?: string): HttpParams {
    let params: HttpParams = new HttpParams();
    if (next) {
      params = params.append('next', btoa(next));
    }
    if (query) {
      params = params.append('search', query);
    }
    return params;
  }

  /**
   * Defines if the Authorization header should be Secondary.
   * @param isSecondary defines if the request is issued from the secondary account.
   * @param withAdditionalAuthorization in some cases, a request requires the primary authorization.
   * Export all songs from "Like Songs" for example requires to be authorized from primary to differentiate from which
   * playlist we're going to export.
   */
  private setSecondaryHeader(isSecondary: boolean, withAdditionalAuthorization?: boolean): HttpHeaders {
    return withAdditionalAuthorization
      ? new HttpHeaders({
        Secondary: isSecondary.toString(),
        AdditionalAuthorization: `Bearer ${SpotifyAuthService.getToken().access_token}`
      })
      : new HttpHeaders({ Secondary: isSecondary.toString() });
  }

}
