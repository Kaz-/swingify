import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap, filter } from 'rxjs/operators';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { NavLink, DialogInput } from 'src/app/shared/models/shared.models';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  navLinks: NavLink[];
  subscriptions: Subscription[] = [];
  isSearching: boolean;
  dialog: DialogInput;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.generateLinks();
    this.dialog = {
      title: 'Search a playlist to export',
      label: `Playlist's name`,
      placeholder: 'Search in playlists',
      action: 'Search'
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private generateLinks(): void {
    this.navLinks = [
      {
        name: 'Home',
        link: '/spotify/home',
        icon: 'home'
      },
      {
        name: 'Export',
        link: '/spotify/export',
        icon: 'magic'
      }
    ];
  }

  get spotifyUser$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  get spotifyPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

  navigate(playlistId: string): void {
    this.subscriptions.push(this.route.queryParams.pipe(
      flatMap(params => this.router.navigate(
        ['/spotify/export'],
        { queryParams: { p: playlistId, s: params.secondary } })
      )
    ).subscribe());
  }

  onSearch(playlistName: string): void {
    this.subscriptions.push(this.spotifyPlaylists$.pipe(
      flatMap(paging => paging.items),
      filter(playlist => playlist.name.toLowerCase().trim().includes(playlistName))
    ).subscribe(playlist => {
      this.navigate(playlist.id);
      this.isSearching = false;
    }));
  }

}
