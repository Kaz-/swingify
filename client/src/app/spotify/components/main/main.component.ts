import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { NavLink } from 'src/app/shared/models/shared.models';

import { SpotifyService } from '../../services/spotify.service';
import { PrimaryService } from '../../services/primary.service';

@Component({
  selector: 'swg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  navLinks: NavLink[];
  subscription: Subscription;
  isSearching: boolean;
  featuredPlaylists$: Observable<SpotifyPaging<SpotifyPlaylist>>;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private primaryService: PrimaryService
  ) { }

  ngOnInit(): void {
    this.initializeLinks();
    this.featuredPlaylists$ = this.spotifyService.getFeaturedPlaylists()
      .pipe(map(featured => featured.playlists));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initializeLinks(): void {
    this.navLinks = [
      {
        name: 'Home',
        link: '/home',
        icon: 'home'
      },
      {
        name: 'Dashboard',
        link: '/spotify/dashboard',
        icon: 'bars'
      },
      {
        name: 'Export',
        link: '/spotify/export',
        icon: 'magic'
      }
    ];
  }

  get user$(): Observable<SpotifyUser> {
    return this.primaryService.primaryUser$;
  }

  get playlists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.primaryService.primaryPlaylists$;
  }

  navigate(playlistId: string): void {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams
      ? this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId, s: tree.queryParams.s } })
      : this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

  onSearch(playlistName: string): void {
    this.subscription = this.playlists$.pipe(
      mergeMap(paging => paging.items),
      filter(playlist => playlist.name.toLowerCase().trim().includes(playlistName))
    ).subscribe(playlist => {
      this.navigate(playlist.id);
      this.isSearching = false;
    });
  }

}
