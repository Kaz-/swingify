import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'swg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  get user$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  get playlists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

  redirect(playlistId: string): void {
    this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

}
