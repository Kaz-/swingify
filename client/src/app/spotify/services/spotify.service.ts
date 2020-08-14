import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyUser, SpotifyPlaylist, SpotifyPaging, PlaylistCreation } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService implements OnDestroy {

  private user: Subject<SpotifyUser> = new Subject<SpotifyUser>();
  private playlists: Subject<SpotifyPaging<SpotifyPlaylist>> = new Subject<SpotifyPaging<SpotifyPlaylist>>();
  user$: Observable<SpotifyUser> = this.user.asObservable().pipe(shareReplay());
  playlists$: Observable<SpotifyPaging<SpotifyPlaylist>> = this.playlists.asObservable().pipe(shareReplay());
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    this.subscriptions.push(this.updateUser(), this.updatePlaylists());
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

  private updateUser(): Subscription {
    return this.getUser(false).subscribe(user => this.user.next(user));
  }

  private updatePlaylists(): Subscription {
    return this.getPlaylists(false).subscribe(playlists => this.playlists.next(playlists));
  }

  getPlaylist(id: string, isSecondary: boolean): Observable<SpotifyPlaylist> {
    return this.http.get<SpotifyPlaylist>(
      `${environment.spotify.serverPath}/playlist/${id}`,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  createPlaylist(userId: string, playlist: PlaylistCreation, isSecondary: boolean): Observable<SpotifyPlaylist> {
    return this.http.post<SpotifyPlaylist>(
      `${environment.spotify.serverPath}/users/${userId}/playlists`, playlist,
      { headers: this.setSecondaryHeader(isSecondary) }
    );
  }

  private setSecondaryHeader(isSecondary: boolean): HttpHeaders {
    return new HttpHeaders({ Secondary: isSecondary ? 'true' : 'false' });
  }

}
