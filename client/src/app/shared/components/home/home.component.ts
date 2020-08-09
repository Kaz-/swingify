import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { SpotifyUser, SpotifyPlaylists } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'exp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  get spotifyUser$(): Observable<SpotifyUser> {
    return this.spotifyService.user$;
  }

  get spotifyPlaylists$(): Observable<SpotifyPlaylists> {
    return this.spotifyService.playlists$;
  }

  redirect(): void {
    this.router.navigateByUrl('/spotify/export');
  }

}
