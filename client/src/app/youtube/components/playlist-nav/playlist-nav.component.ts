import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../../models/youtube.models';
import { PlaylistAction, ETrackAction } from '../../../shared/models/shared.models';
import { LIKED_ID } from '../../../spotify/models/spotify.models';

import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'swg-youtube-playlist-nav',
  templateUrl: './playlist-nav.component.html',
  styleUrls: ['./playlist-nav.component.scss']
})
export class PlaylistNavComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<Details<Snippet>>;
  @Input() playlists$: Observable<YoutubePaging<PlaylistOverview>>;
  @Input() playlist$: Observable<Details<PlaylistOverview>>;
  @Input() playlistTracks$: Observable<YoutubePaging<PlaylistItem>>;
  @Input() platform: string;
  @Input() isAuthenticated: boolean;

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
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
    return this.setupPlaylist(source$);
  }

  setupPlaylist(source$: Observable<Params>): Subscription {
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
