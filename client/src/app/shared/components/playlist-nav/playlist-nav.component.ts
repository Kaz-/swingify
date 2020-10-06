import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

import { LIKED_ID, PlaylistTrack, SavedTrack, SpotifyPaging, SpotifyPlaylist, SpotifyUser } from '../../../spotify/models/spotify.models';
import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../../../youtube/models/youtube.models';
import { Platform } from '../../../shared/models/shared.models';

import { PrimaryService } from '../../../spotify/services/primary.service';
import { SecondaryService } from '../../../spotify/services/secondary.service';
import { SpotifyAuthService } from '../../../shared/services/spotify-auth.service';

import { YoutubeService } from '../../../youtube/services/youtube.service';
import { YoutubeAuthService } from '../../services/youtube-auth.service';

@Component({
  selector: 'swg-playlist-nav',
  templateUrl: './playlist-nav.component.html',
  styleUrls: ['./playlist-nav.component.scss']
})
export class PlaylistNavComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<SpotifyUser | Details<Snippet>>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist> | YoutubePaging<PlaylistOverview>>;
  @Input() playlist$: Observable<SpotifyPlaylist | Details<PlaylistOverview>>;
  @Input() playlistTracks$: Observable<SpotifyPaging<PlaylistTrack> | YoutubePaging<PlaylistItem>>;
  @Input() savedTracks$?: Observable<SpotifyPaging<SavedTrack>>;
  @Input() isSecondary: boolean;
  @Input() platform: string;
  @Input() isAuthenticated: boolean;

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private youtubeAuthService: YoutubeAuthService,
    private primaryService: PrimaryService,
    private secondaryService: SecondaryService,
    private youtubeService: YoutubeService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.initPlaylist());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  initPlaylist(): Subscription {
    const source$: Observable<Params> = this.route.queryParams.pipe(
      tap(params => this.primaryId = params.p),
      tap(params => this.secondaryId = params.s)
    );
    return this.isSecondary
      ? this.setupSecondary(source$)
      : this.setupPrimary(source$);
  }

  setupPrimary(source$: Observable<Params>): Subscription {
    console.log(this.platform);
    switch (this.platform) {
      case Platform.YOUTUBE.toLowerCase():
        return this.setupAsYoutube(source$);
      case Platform.SPOTIFY.toLowerCase():
      default:
        return this.setupAsSpotify(source$);
    }
  }

  private setupAsSpotify(source$: Observable<Params>): Subscription {
    return source$.pipe(
      map(params => params.p),
      distinctUntilChanged(),
      mergeMap(primary => primary
        ? primary === LIKED_ID
          ? this.primaryService.getPrimarySavedTracks()
          : this.primaryService.getPrimaryPlaylist(primary)
        : EMPTY
      )).subscribe();
  }

  private setupAsYoutube(source$: Observable<Params>): Subscription {
    return source$.pipe(
      map(params => params.p),
      distinctUntilChanged(),
      mergeMap(primary => primary
        ? primary === LIKED_ID
          ? this.youtubeService.getPlaylist(primary)
          : this.youtubeService.getPlaylist(primary)
        : EMPTY
      )).subscribe();
  }

  setupSecondary(source$: Observable<Params>): Subscription {
    return source$.pipe(
      map(params => params.s),
      distinctUntilChanged(),
      mergeMap(secondary => secondary
        ? secondary === LIKED_ID
          ? this.secondaryService.getsecondarySavedTracks()
          : this.secondaryService.getSecondaryPlaylist(secondary)
        : EMPTY
      )).subscribe();
  }

  navigateBack(): void {
    if (this.isSecondary) {
      this.router.navigate(['/spotify/export'], { queryParams: { p: this.primaryId } });
      this.secondaryService.resetSecondary();
    } else {
      switch (this.platform) {
        case Platform.YOUTUBE.toLowerCase():
          this.router.navigate(['/youtube/export'], { queryParams: { s: this.secondaryId } });
          this.primaryService.resetPrimary();
          break;
        case Platform.SPOTIFY.toLowerCase():
        default:
          this.router.navigate(['/spotify/export'], { queryParams: { s: this.secondaryId } });
          this.primaryService.resetPrimary();
          break;
      }
    }
  }

  authenticate(): void {
    switch (this.platform) {
      case Platform.YOUTUBE.toLowerCase():
        this.subscriptions.push(this.youtubeAuthService.authorize().subscribe());
        break;
      case Platform.SPOTIFY.toLowerCase():
      default:
        this.subscriptions.push(this.spotifyAuthService.authorize().subscribe());
        break;
    }
  }

}
