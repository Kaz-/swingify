import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { PrimaryService } from '../../services/primary.service';

@Component({
  selector: 'swg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private primaryService: PrimaryService
  ) { }

  get user$(): Observable<SpotifyUser> {
    return this.primaryService.primaryUser$;
  }

  get playlists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.primaryService.primaryPlaylists$;
  }

  redirect(playlistId: string): void {
    this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

}
