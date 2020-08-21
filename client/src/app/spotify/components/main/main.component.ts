import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { NavLink, NAV_LINKS } from '../../../shared/models/shared.models';
import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
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
    return this.spotifyService.primaryUser$;
  }

  get spotifyPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

}