import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { NavLink } from 'src/app/shared/models/shared.models';
import { Details, PlaylistOverview, Snippet, YoutubePaging } from '../../models/youtube.models';

import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'swg-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  navLinks: NavLink[];
  subscriptions: Subscription[] = [];
  isSearching: boolean;

  constructor(
    private router: Router,
    private youtubeService: YoutubeService
  ) { }

  ngOnInit(): void {
    this.initializeLinks();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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
        link: '/youtube/dashboard',
        icon: 'bars'
      },
      {
        name: 'Export',
        link: '/youtube/export',
        icon: 'magic'
      }
    ];
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

  onSearch(playlistName: string): void {
    // TODO
  }

}
