import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject, EMPTY, from, forkJoin } from 'rxjs';
import { flatMap, shareReplay, tap, scan } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { SpotifyPlaylist, SpotifyUser, SpotifyPaging, PlaylistTrack } from '../../models/spotify.models';
import { PlaylistAction, ETrackAction } from 'src/app/shared/models/shared.models';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {

  primaryPlaylist: Subject<SpotifyPlaylist> = new Subject<SpotifyPlaylist>();
  primaryPlaylist$: Observable<SpotifyPlaylist> = this.primaryPlaylist.asObservable().pipe(shareReplay());
  primaryPlaylistTracks: Subject<SpotifyPaging<PlaylistTrack>> = new Subject<SpotifyPaging<PlaylistTrack>>();
  primaryPlaylistTracks$: Observable<SpotifyPaging<PlaylistTrack>> = this.primaryPlaylistTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<PlaylistTrack>, next: SpotifyPaging<PlaylistTrack>) => this.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  secondaryPlaylist: Subject<SpotifyPlaylist> = new Subject<SpotifyPlaylist>();
  secondaryPlaylist$: Observable<SpotifyPlaylist> = this.secondaryPlaylist.asObservable().pipe(shareReplay());
  secondaryPlaylistTracks: Subject<SpotifyPaging<PlaylistTrack>> = new Subject<SpotifyPaging<PlaylistTrack>>();
  secondaryPlaylistTracks$: Observable<SpotifyPaging<PlaylistTrack>> = this.secondaryPlaylistTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<PlaylistTrack>, next: SpotifyPaging<PlaylistTrack>) => this.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  private primaryId: string;
  private secondaryId: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private authService: AuthService
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

  get primaryUser$(): Observable<SpotifyUser> {
    return this.spotifyService.primaryUser$;
  }

  get primaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.primaryPlaylists$;
  }

  get secondaryUser$(): Observable<SpotifyUser> {
    return this.spotifyService.secondaryUser$;
  }

  get secondaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.spotifyService.secondaryPlaylists$;
  }

  private initPrimaryPlaylist(): Subscription {
    return this.route.params.pipe(
      tap(params => this.primaryId = params.id),
      flatMap(params => this.getPrimaryPlaylist(params.id))
    ).subscribe();
  }

  private getPrimaryPlaylist(id: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylist(id, false).pipe(
      tap(playlist => this.updatePrimaryPlaylist(playlist)),
      flatMap(playlist => this.getPrimaryPlaylistTracks(playlist.id))
    );
  }

  private getPrimaryPlaylistTracks(id: string, next?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylistTracks(id, false, next).pipe(
      tap(tracks => tracks.parentId = id),
      tap(tracks => this.updatePrimaryPlaylistTracks(tracks))
    );
  }

  private updatePrimaryPlaylist(playlist: SpotifyPlaylist): void {
    this.primaryPlaylist.next(playlist);
  }

  private updatePrimaryPlaylistTracks(tracks: SpotifyPaging<PlaylistTrack>): void {
    this.primaryPlaylistTracks.next(tracks);
  }

  private initSecondaryPlaylist(): Subscription {
    return this.route.queryParams.pipe(
      tap(params => this.secondaryId = params.secondary),
      flatMap(params => params.secondary ? this.getSecondaryPlaylist(params.secondary) : EMPTY)
    ).subscribe();
  }

  private getSecondaryPlaylist(id: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylist(id, true).pipe(
      tap(playlist => this.updateSecondaryPlaylist(playlist)),
      flatMap(playlist => playlist ? this.getSecondaryPlaylistTracks(playlist.id) : EMPTY)
    );
  }

  private getSecondaryPlaylistTracks(id: string, next?: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylistTracks(id, true, next).pipe(
      tap(tracks => tracks.parentId = id),
      tap(tracks => this.updateSecondaryPlaylistTracks(tracks))
    );
  }

  private updateSecondaryPlaylist(playlist: SpotifyPlaylist): void {
    this.secondaryPlaylist.next(playlist);
  }

  private updateSecondaryPlaylistTracks(tracks: SpotifyPaging<PlaylistTrack>): void {
    this.secondaryPlaylistTracks.next(tracks);
  }

  private handleEmittedTracks(
    prev: SpotifyPaging<PlaylistTrack>,
    next: SpotifyPaging<PlaylistTrack>): SpotifyPaging<PlaylistTrack> {
    return prev.parentId === next.parentId && next.items.length > 0
      ? { ...next, items: [...prev.items, ...next.items] } : next;
  }

  isLargeScreen(): boolean {
    return window.screen.width > 1280;
  }

  isSecondaryAuthenticated(): boolean {
    return AuthService.isSecondaryAuthenticated();
  }

  authenticate(): void {
    this.authService.authorize().subscribe();
  }

  navigateBack(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} });
    this.updateSecondaryPlaylist(null);
  }

  execute(action: PlaylistAction): void {
    const chunks$: Observable<string[]> = this.chunkTracks(action.trackUris);
    forkJoin([chunks$.pipe(
      flatMap(tracks => this.performOnTracks(action, tracks))
    )]).pipe(
      flatMap(() => this.getSecondaryPlaylist(this.secondaryId))
    ).subscribe();
  }

  performOnTracks(action: PlaylistAction, tracks: string[]): Observable<ArrayBuffer | never> {
    switch (action.action) {
      case ETrackAction.ADD:
        return this.spotifyService.addTracks(this.secondaryId, tracks);
      case ETrackAction.REMOVE:
        return this.spotifyService.removeTracks(this.secondaryId, tracks);
      default:
        break;
    }
  }

  private chunkTracks(tracks: string[]): Observable<string[]> {
    // maximum 100 items per request
    const max = 100;
    return from(Array(Math.ceil(tracks.length / max))
      .fill(null)
      .map(() => tracks.splice(0, max), tracks.slice()));
  }

  onNext(next: string, isSecondary: boolean): void {
    isSecondary
      ? this.subscriptions.push(this.getSecondaryPlaylistTracks(this.secondaryId, next).subscribe())
      : this.subscriptions.push(this.getPrimaryPlaylistTracks(this.primaryId, next).subscribe());
  }

}
