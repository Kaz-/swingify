import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { NavLink, NAV_LINKS } from 'src/app/shared/models/shared.models';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy {

  navLinks: NavLink[] = NAV_LINKS;
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get spotifyUser$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  get spotifyPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

  navigate(playlistId: string): void {
    this.subscription = this.route.queryParams.pipe(
      flatMap(params => this.router.navigate(
        ['/spotify/export', playlistId],
        { queryParams: { secondary: params.secondary } })
      )
    ).subscribe();
  }

}
