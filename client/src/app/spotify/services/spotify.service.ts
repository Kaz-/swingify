import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyUser, SpotifyPlaylist, SpotifyPaging, PlaylistCreation } from '../models/spotify.models';
import { AuthService } from 'src/app/shared/services/auth.service';

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
