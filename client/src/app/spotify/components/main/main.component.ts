import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, UrlTree, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

import { SpotifyUser, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';
import { NavLink, DialogInput } from 'src/app/shared/models/shared.models';

import { SpotifyService } from '../../services/spotify.service';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'swg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('loader') loader: ElementRef;

  version: string = environment.productVersion;
  navLinks: NavLink[];
  subscriptions: Subscription[] = [];
  isSearching: boolean;
  dialog: DialogInput;
  featuredPlaylists$: Observable<SpotifyPaging<SpotifyPlaylist>>;

  constructor(
    private router: Router,
    private spotifyService: SpotifyService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initializeLinks();
    this.initializeDialog();
    this.featuredPlaylists$ = this.spotifyService.getFeaturedPlaylists()
      .pipe(map(featured => featured.playlists));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((event: RouterEvent) =>
        this.loaderService.navigationInterceptor(event, this.loader))
    );
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

  private initializeDialog(): void {
    this.dialog = {
      title: 'Search a playlist to export',
      label: `Playlist's name`,
      placeholder: 'Search in playlists',
      action: 'Search'
    };
  }

  get user$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  get playlists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
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
      this.playlists$.pipe(
        mergeMap(paging => paging.items),
        filter(playlist => playlist.name.toLowerCase().trim().includes(playlistName))
      ).subscribe(playlist => {
        this.navigate(playlist.id);
        this.isSearching = false;
      })
    );
  }

}
