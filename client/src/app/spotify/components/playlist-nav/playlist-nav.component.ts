import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { PlaylistAction, ETrackAction } from '../../../shared/models/shared.models';
import { LIKED_ID, PlaylistTrack, SavedTrack, SpotifyPaging, SpotifyPlaylist, SpotifyUser } from '../../models/spotify.models';

import { PrimaryService } from '../../services/primary.service';
import { SecondaryService } from '../../services/secondary.service';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'swg-spotify-playlist-nav',
  templateUrl: './playlist-nav.component.html',
  styleUrls: ['./playlist-nav.component.scss']
})
export class PlaylistNavComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<SpotifyUser>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() playlist$: Observable<SpotifyPlaylist>;
  @Input() playlistTracks$: Observable<SpotifyPaging<PlaylistTrack>>;
  @Input() savedTracks$?: Observable<SpotifyPaging<SavedTrack>>;
  @Input() isSecondary: boolean;
  @Input() platform: string;
  @Input() isAuthenticated: boolean;

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spotifyService: SpotifyService,
    private primaryService: PrimaryService,
    private secondaryService: SecondaryService
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

  execute(action: PlaylistAction): void {
    this.subscriptions.push(this.performOnTracks(action).pipe(
      mergeMap(() => this.secondaryId === LIKED_ID
        ? this.secondaryService.getsecondarySavedTracks()
        : this.secondaryService.getSecondaryPlaylist(this.secondaryId))
    ).subscribe(() => this.onSuccess(action)));
  }

  performOnTracks(action: PlaylistAction): Observable<ArrayBuffer | never> {
    return this.secondaryId === LIKED_ID
      ? this.actionOnSavedTracks(action)
      : this.actionOnPlaylist(action);
  }

  private actionOnSavedTracks(action: PlaylistAction): Observable<ArrayBuffer | never> {
    switch (action.action) {
      case ETrackAction.ADD:
        return action.complete
          ? this.spotifyService.saveTracks(action.trackId, this.primaryId)
          : this.spotifyService.saveTracks(action.trackId);
      case ETrackAction.REMOVE:
        return action.complete
          ? this.spotifyService.removeSavedTracks(action.trackId, this.secondaryId)
          : this.spotifyService.removeSavedTracks(action.trackId);
      default:
        break;
    }
  }

  private actionOnPlaylist(action: PlaylistAction): Observable<ArrayBuffer | never> {
    switch (action.action) {
      case ETrackAction.ADD:
        return action.complete
          ? this.spotifyService.addTracks(this.secondaryId, action.trackUri, this.primaryId)
          : this.spotifyService.addTracks(this.secondaryId, action.trackUri);
      case ETrackAction.REMOVE:
        return action.complete
          ? this.spotifyService.removeTracks(this.secondaryId, action.trackUri, this.secondaryId)
          : this.spotifyService.removeTracks(this.secondaryId, action.trackUri);
      default:
        break;
    }
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
    if (inSavedTracks) {
      this.isSecondary
        ? this.subscriptions.push(this.secondaryService.getsecondarySavedTracks(true, next).subscribe())
        : this.subscriptions.push(this.primaryService.getPrimarySavedTracks(true, next).subscribe());
    } else {
      this.isSecondary
        ? this.subscriptions.push(this.secondaryService.getSecondaryPlaylistTracks(this.secondaryId, true, next).subscribe())
        : this.subscriptions.push(this.primaryService.getPrimaryPlaylistTracks(this.primaryId, true, next).subscribe());
    }
  }

  onSearch(query: string, inSavedTracks: boolean): void {
    if (inSavedTracks) {
      this.isSecondary
        ? this.subscriptions.push(this.secondaryService.getsecondarySavedTracks(false, null, query).subscribe())
        : this.subscriptions.push(this.primaryService.getPrimarySavedTracks(false, null, query).subscribe());
    } else {
      this.isSecondary
        ? this.subscriptions.push(this.secondaryService.getSecondaryPlaylistTracks(this.secondaryId, false, null, query).subscribe())
        : this.subscriptions.push(this.primaryService.getPrimaryPlaylistTracks(this.primaryId, false, null, query).subscribe());
    }
  }

}
