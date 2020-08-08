import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { NavLink, NAV_LINKS } from '../../../shared/models/shared.models';
import { SpotifyUser, SpotifyPlaylists } from 'src/app/spotify/models/spotify.models';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  navLinks: NavLink[] = NAV_LINKS;
  spotifyUser$: Observable<SpotifyUser>;
  spotifyPlaylists$: Observable<SpotifyPlaylists>;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyUser$ = this.spotifyService.getUser().pipe(shareReplay());
    this.spotifyPlaylists$ = this.spotifyService.getPlaylists();
  }

}
