import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, UrlTree, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap, filter } from 'rxjs/operators';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { NavLink, DialogInput } from 'src/app/shared/models/shared.models';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'exp-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('loader') loader: ElementRef;

  navLinks: NavLink[];
  subscriptions: Subscription[] = [];
  isSearching: boolean;
  dialog: DialogInput;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private loaderService: LoaderService
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

  ngAfterViewInit(): void {
    this.router.events.subscribe((event: RouterEvent) =>
    this.loaderService.navigationInterceptor(event, this.loader));
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
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams
      ? this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId, s: tree.queryParams.s } })
      : this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

  onSearch(playlistName: string): void {
    this.subscriptions.push(
      this.spotifyPlaylists$.pipe(
        flatMap(paging => paging.items),
        filter(playlist => playlist.name.toLowerCase().trim().includes(playlistName))
      ).subscribe(playlist => {
        this.navigate(playlist.id);
        this.isSearching = false;
      })
    );
  }

}
