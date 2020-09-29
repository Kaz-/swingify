import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, UrlTree, RouterEvent } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { NavLink, DialogInput } from 'src/app/shared/models/shared.models';

import { YoutubeService } from '../../services/youtube.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Details, PlaylistOverview, Snippet, YoutubePaging } from '../../models/youtube.models';

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

  constructor(
    private router: Router,
    private youtubeService: YoutubeService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.initializeLinks();
    this.initializeDialog();
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
        name: 'Dashboard',
        link: '/dashboard',
        icon: 'bars'
      },
      {
        name: 'Home',
        link: '/youtube/home',
        icon: 'home'
      },
      {
        name: 'Export',
        link: '/youtube/export',
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

  get user$(): Observable<Details<Snippet>> {
    return this.youtubeService.user$;
  }

  get playlists$(): Observable<YoutubePaging<PlaylistOverview>> {
    return this.youtubeService.playlists$;
  }

  navigate(playlistId: string): void {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams
      ? this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId, s: tree.queryParams.s } })
      : this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

}
