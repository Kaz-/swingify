import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NavLink, NAV_LINKS } from '../../../shared/models/shared.models';
import { SpotifyUser, SpotifyPlaylists } from 'src/app/spotify/models/spotify.models';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  navLinks: NavLink[] = NAV_LINKS;

  constructor(private spotifyService: SpotifyService) { }

  get spotifyUser$(): Observable<SpotifyUser> {
    return this.spotifyService.user$;
  }

  get spotifyPlaylists$(): Observable<SpotifyPlaylists> {
    return this.spotifyService.playlists$;
  }

}
