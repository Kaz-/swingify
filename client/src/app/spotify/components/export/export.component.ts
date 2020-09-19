import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, EMPTY } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { AuthService } from 'src/app/shared/services/auth.service';
import { SpotifyService } from '../../services/spotify.service';
import { PrimaryService } from '../../services/primary.service';
import { SecondaryService } from '../../services/secondary.service';

import { SpotifyPlaylist, SpotifyUser, SpotifyPaging, PlaylistTrack, SavedTrack } from '../../models/spotify.models';
import { PlaylistAction, ETrackAction } from 'src/app/shared/models/shared.models';

@Component({
  selector: 'swg-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private primaryService: PrimaryService,
    private secondaryService: SecondaryService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.initPrimaryPlaylist());
    if (this.isSecondaryAuthenticated()) {
      this.subscriptions.push(
        this.spotifyService.updateUser(true),
        this.spotifyService.updatePlaylists(true),
        this.initSecondaryPlaylist()
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Returns the current primary user
   */
  get primaryUser$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  /**
   * Returns all primary playlists
   */
  get primaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

  /**
   * Returns a single primary playlist
   */
  get primaryPlaylist$(): Observable<SpotifyPlaylist> {
    return this.primaryService.primaryPlaylist$;
  }

  /**
   * Returns all tracks from a primary playlist
   */
  get primaryPlaylistTracks$(): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.primaryService.primaryPlaylistTracks$;
  }

  /**
   * Returns all saved tracks from primary user
   */
  get primarySavedTracks$(): Observable<SpotifyPaging<SavedTrack>> {
    return this.primaryService.primarySavedTracks$;
  }

  /**
   * Returns the current secondary user
   */
  get secondaryUser$(): Observable<SpotifyUser> {
    return this.spotifyService.secondaryUser$;
  }

  /**
   * Returns all secondary playlists
   */
  get secondaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.secondaryPlaylists$;
  }

  /**
   * Returns a single secondary playlist
   */
  get secondaryPlaylist$(): Observable<SpotifyPlaylist> {
    return this.secondaryService.secondaryPlaylist$;
  }

  /**
   * Returns all tracks from a secondary playlist
   */
  get secondaryPlaylistTracks$(): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.secondaryService.secondaryPlaylistTracks$;
  }

  /**
   * Returns all saved tracks from secondary user
   */
  get secondarySavedTracks$(): Observable<SpotifyPaging<SavedTrack>> {
    return this.secondaryService.secondarySavedTracks$;
  }

  private initPrimaryPlaylist(): Subscription {
    return this.route.queryParams.pipe(
      tap(params => this.primaryId = params.p),
      mergeMap(params => {
        return params.p
          ? params.p === 'liked' ? this.primaryService.getPrimarySavedTracks() : this.primaryService.getPrimaryPlaylist(params.p)
          : EMPTY;
      })
    ).subscribe();
  }

  private initSecondaryPlaylist(): Subscription {
    return this.route.queryParams.pipe(
      tap(params => this.secondaryId = params.s),
      mergeMap(params => {
        return params.s
          ? params.s === 'liked' ? this.secondaryService.getsecondarySavedTracks() : this.secondaryService.getSecondaryPlaylist(params.s)
          : EMPTY;
      })
    ).subscribe();
  }

  isLargeScreen(): boolean {
    return window.screen.width > 1750;
  }

  isSecondaryAuthenticated(): boolean {
    return AuthService.isSecondaryAuthenticated();
  }

  authenticate(): void {
    this.authService.authorize().subscribe();
  }

  navigateBack(isSecondary?: boolean): void {
    if (isSecondary) {
      this.router.navigate(['/spotify/export'], { queryParams: { p: this.primaryId } });
      this.secondaryService.updateSecondaryPlaylist(null);
      this.secondaryService.updateSecondarySavedTracks(null);
    } else {
      this.router.navigate(['/spotify/export'], { queryParams: { s: this.secondaryId } });
      this.primaryService.updatePrimaryPlaylist(null);
      this.primaryService.updatePrimarySavedTracks(null);
    }
  }

  execute(action: PlaylistAction): void {
    this.subscriptions.push(this.performOnTracks(action).pipe(
      mergeMap(() => this.secondaryService.getSecondaryPlaylist(this.secondaryId))
    ).subscribe(() => this.onSuccess(action)));
  }

  performOnTracks(action: PlaylistAction): Observable<ArrayBuffer | never> {
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

  onNext(next: string, isSecondary: boolean): void {
    isSecondary
      ? this.subscriptions.push(this.secondaryService.getSecondaryPlaylistTracks(this.secondaryId, true, next).subscribe())
      : this.subscriptions.push(this.primaryService.getPrimaryPlaylistTracks(this.primaryId, true, next).subscribe());
  }

  onSearch(query: string, isSecondary: boolean): void {
    isSecondary
      ? this.subscriptions.push(this.secondaryService.getSecondaryPlaylistTracks(this.secondaryId, false, null, query).subscribe())
      : this.subscriptions.push(this.primaryService.getPrimaryPlaylistTracks(this.primaryId, false, null, query).subscribe());
  }

}
