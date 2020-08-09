import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyUser, SpotifyPlaylists } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private user: Subject<SpotifyUser> = new Subject<SpotifyUser>();
  private playlists: Subject<SpotifyPlaylists> = new Subject<SpotifyPlaylists>();
  user$: Observable<SpotifyUser> = this.user.asObservable().pipe(shareReplay());
  playlists$: Observable<SpotifyPlaylists> = this.playlists.asObservable().pipe(shareReplay());

  constructor(private http: HttpClient) {
    this.updateUser();
    this.updatePlaylists();
  }

  private updateUser(): void {
    this.http.get<SpotifyUser>(`${environment.spotify.serverPath}/me`)
      .subscribe(user => this.user.next(user));
  }

  private updatePlaylists(): void {
    this.http.get<SpotifyPlaylists>(`${environment.spotify.serverPath}/playlists`)
      .subscribe(playlists => this.playlists.next(playlists));
  }

}
