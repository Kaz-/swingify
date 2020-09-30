import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../../models/youtube.models';
import { PlaylistAction, ETrackAction } from '../../../shared/models/shared.models';

import { YoutubeAuthService } from '../../../shared/services/youtube-auth.service';
import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'swg-playlist-nav',
  templateUrl: './playlist-nav.component.html',
  styleUrls: ['./playlist-nav.component.scss']
})
export class PlaylistNavComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<Details<Snippet>>;
  @Input() playlists$: Observable<YoutubePaging<PlaylistOverview>>;
  @Input() playlistTracks$: Observable<YoutubePaging<PlaylistItem>>;
  @Input() isAuthenticated: boolean;

  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private youtubeService: YoutubeService,
    private authService: YoutubeAuthService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.initPlaylist());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  initPlaylist(): Subscription {
    const source$: Observable<Params> = this.route.queryParams.pipe(
      tap(params => this.secondaryId = params.s)
    );
    return this.setupPlaylist(source$);
  }

  setupPlaylist(source$: Observable<Params>): Subscription {
    return source$.pipe(
      map(params => params.p),
      distinctUntilChanged(),
      mergeMap(playlist => this.youtubeService.getPlaylistTracks(playlist)
      )).subscribe();
  }

  navigateBack(): void {
    this.router.navigate(['/youtube/export'], { queryParams: { s: this.secondaryId } });
    this.youtubeService.resetPlaylist();
  }

  authenticate(): void {
    this.subscriptions.push(this.authService.authorize().subscribe());
  }

  execute(action: PlaylistAction): void {
    // TODO
  }

  performOnTracks(action: PlaylistAction): void {
    // TODO
  }

  private actionOnSavedTracks(action: PlaylistAction): void {
    // TODO
  }

  private actionOnPlaylist(action: PlaylistAction): void {
    // TODO
  }

  private onSuccess(action: PlaylistAction): void {
    switch (action.action) {
      case ETrackAction.ADD:
        action.complete
          ? this.toastr.success('Tracks were successfully added!', null, { progressBar: true, timeOut: 2000 })
          : this.toastr.success('Track was successfully added!', null, { progressBar: true, timeOut: 2000 });
        break;
      case ETrackAction.REMOVE:
        action.complete
          ? this.toastr.success('Tracks were successfully removed!', null, { progressBar: true, timeOut: 2000 })
          : this.toastr.success('Track was successfully removed!', null, { progressBar: true, timeOut: 2000 });
        break;
      default:
        break;
    }
  }

  onNext(next: string, inSavedTracks: boolean): void {
    // TODO
  }

  onSearch(query: string, inSavedTracks: boolean): void {
    // TODO
  }

}
