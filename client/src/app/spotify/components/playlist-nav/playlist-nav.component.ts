import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

import { PrimaryService } from '../../../spotify/services/primary.service';
import { SecondaryService } from '../../../spotify/services/secondary.service';
import { SpotifyService } from '../../../spotify/services/spotify.service';
import { SpotifyAuthService } from '../../../shared/services/spotify-auth.service';

import { LIKED_ID, PlaylistTrack, SavedTrack, SpotifyPaging, SpotifyPlaylist, SpotifyUser } from '../../../spotify/models/spotify.models';
import { PlaylistAction, ETrackAction } from '../../../shared/models/shared.models';

@Component({
  selector: 'swg-playlist-nav',
  templateUrl: './playlist-nav.component.html',
  styleUrls: ['./playlist-nav.component.scss']
})
export class PlaylistNavComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<SpotifyUser>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() playlist$: Observable<SpotifyPlaylist>;
  @Input() playlistTracks$: Observable<SpotifyPaging<PlaylistTrack>>;
  @Input() savedTracks$: Observable<SpotifyPaging<SavedTrack>>;
  @Input() isSecondary: boolean;
  @Input() isAuthenticated: boolean;

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: SpotifyAuthService,
    private spotifyService: SpotifyService,
    private primaryService: PrimaryService,
    private secondaryService: SecondaryService
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

  authenticate(): void {
    this.subscriptions.push(this.authService.authorize().subscribe());
  }

  navigateBack(): void {
    if (this.isSecondary) {
      this.router.navigate(['/spotify/export'], { queryParams: { p: this.primaryId } });
      this.secondaryService.resetSecondary();
    } else {
      this.router.navigate(['/spotify/export'], { queryParams: { s: this.secondaryId } });
      this.primaryService.resetPrimary();
    }
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
