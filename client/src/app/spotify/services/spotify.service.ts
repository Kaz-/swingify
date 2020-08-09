import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyUser, SpotifyPlaylists, SpotifyPlaylist } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService implements OnDestroy {

  private user: Subject<SpotifyUser> = new Subject<SpotifyUser>();
  private playlists: Subject<SpotifyPlaylists> = new Subject<SpotifyPlaylists>();
  user$: Observable<SpotifyUser> = this.user.asObservable().pipe(shareReplay());
  playlists$: Observable<SpotifyPlaylists> = this.playlists.asObservable().pipe(shareReplay());
  private subscriptions: Subscription[] = [];

  constructor(private http: HttpClient) {
    this.subscriptions.push(this.updateUser(), this.updatePlaylists());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private updateUser(): Subscription {
    return this.http.get<SpotifyUser>(`${environment.spotify.serverPath}/me`)
      .subscribe(user => this.user.next(user));
  }

  private updatePlaylists(): Subscription {
    return this.http.get<SpotifyPlaylists>(`${environment.spotify.serverPath}/playlists`)
      .subscribe(playlists => this.playlists.next(playlists));
  }

  getPlaylist(id: number): Observable<SpotifyPlaylist> {
    return this.http.get<SpotifyPlaylist>(`${environment.spotify.serverPath}/playlist/${id}`);
  }

}
