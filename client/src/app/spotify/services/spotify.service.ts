import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyUser, SpotifyPlaylist, SpotifyPaging, PlaylistCreation, PlaylistTrack } from '../models/spotify.models';

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

  constructor(private http: HttpClient) {
    this.subscriptions.push(
      this.updateUser(false),
      this.updatePlaylists(false)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getUser(isSecondary: boolean): Observable<SpotifyUser> {
    return this.http.get<SpotifyUser>(
      `${environment.spotify.serverPath}/me`,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  getPlaylists(isSecondary: boolean): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.http.get<SpotifyPaging<SpotifyPlaylist>>(
      `${environment.spotify.serverPath}/playlists`,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
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
      `${environment.spotify.serverPath}/playlists/${id}`,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  getPlaylistTracks(id: string, isSecondary: boolean, next?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(
      `${environment.spotify.serverPath}/playlists/${id}/tracks`,
      { params: next ? new HttpParams().set('next', btoa(next)) : null, headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  createPlaylist(userId: string, playlist: PlaylistCreation, isSecondary: boolean): Observable<SpotifyPlaylist> {
    return this.http.post<SpotifyPlaylist>(
      `${environment.spotify.serverPath}/users/${userId}/playlists`, playlist,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  addTracks(id: string, tracks: string[]): Observable<never> {
    return this.http.post<never>(
      `${environment.spotify.serverPath}/playlists/${id}`, tracks,
      { headers: this.setSecondaryHeader(true) }
    );
  }

  removeTracks(id: string, tracks: string[]): Observable<ArrayBuffer> {
    return this.http.request<ArrayBuffer>('delete',
      `${environment.spotify.serverPath}/playlists/${id}`,
      { body: tracks, headers: this.setSecondaryHeader(true) }
    );
  }

  private setSecondaryHeader(isSecondary: boolean): HttpHeaders {
    return new HttpHeaders({ Secondary: isSecondary ? 'true' : 'false' });
  }

}
