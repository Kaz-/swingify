import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PlaylistTrack, SavedTrack, SpotifyPaging, SpotifyPlaylist, SpotifyUser } from '../../../spotify/models/spotify.models';
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
    this.subscriptions.push(
      this.route.queryParams.pipe(
        tap(params => this.primaryId = params.p),
        tap(params => this.secondaryId = params.s)
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  navigateBack(): void {
    switch (this.platform) {
      case Platform.YOUTUBE.toLowerCase():
        this.navigateAsYoutube();
        break;
      case Platform.SPOTIFY.toLowerCase():
      default:
        this.navigateAsSpotify();
        break;
    }
  }

  navigateAsSpotify(): void {
    if (this.isSecondary) {
      this.router.navigate(['/spotify/export'], { queryParams: { p: this.primaryId } });
      this.secondaryService.resetSecondary();
    } else {
      this.router.navigate(['/spotify/export'], { queryParams: { s: this.secondaryId } });
      this.primaryService.resetPrimary();
    }
  }

  navigateAsYoutube(): void {
    if (this.isSecondary) {
      this.router.navigate(['/youtube/export'], { queryParams: { p: this.primaryId } });
      this.secondaryService.resetSecondary();
    } else {
      this.router.navigate(['/youtube/export'], { queryParams: { s: this.secondaryId } });
      this.primaryService.resetPrimary();
      this.youtubeService.resetPlaylist();
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
