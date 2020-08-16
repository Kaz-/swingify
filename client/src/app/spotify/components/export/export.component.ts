import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject, EMPTY } from 'rxjs';
import { flatMap, shareReplay, tap } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { SpotifyPlaylist, SpotifyUser, SpotifyPaging } from '../../models/spotify.models';
import { PlaylistAction, ETrackAction } from 'src/app/shared/models/shared.models';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {

  primaryPlaylist$: Observable<SpotifyPlaylist>;
  secondaryPlaylist: Subject<SpotifyPlaylist> = new Subject<SpotifyPlaylist>();
  secondaryPlaylist$: Observable<SpotifyPlaylist> = this.secondaryPlaylist.asObservable().pipe(shareReplay());

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
    this.primaryPlaylist$ = this.initPrimaryPlaylist();
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

  private initPrimaryPlaylist(): Observable<SpotifyPlaylist> {
    return this.route.params.pipe(
      tap(params => this.primaryId = params.id),
      flatMap(params => this.spotifyService.getPlaylist(params.id, false)),
      shareReplay()
    );
  }

  private initSecondaryPlaylist(): Subscription {
    return this.route.queryParams.pipe(
      tap(params => this.secondaryId = params.secondary),
      flatMap(params => params.secondary ? this.getSecondaryPlaylist(params.secondary) : EMPTY)
    ).subscribe();
  }

  getSecondaryPlaylist(id: string): Observable<SpotifyPlaylist> {
    return this.spotifyService.getPlaylist(id, true).pipe(
      tap(playlist => this.updateSecondaryPlaylist(playlist))
    );
  }

  private updateSecondaryPlaylist(playlist: SpotifyPlaylist): void {
    this.secondaryPlaylist.next(playlist);
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
    switch (action.action) {
      case ETrackAction.ADD:
        this.subscriptions.push(this.addTracks(action));
        break;
      case ETrackAction.REMOVE:
        this.subscriptions.push(this.removeTracks(action));
        break;
      default:
        break;
    }
  }

  private addTracks(action: PlaylistAction): Subscription {
    return this.spotifyService.addTracks(this.secondaryId, [action.trackUri]).pipe(
      flatMap(() => this.getSecondaryPlaylist(this.secondaryId)),
    ).subscribe();
  }

  private removeTracks(action: PlaylistAction): Subscription {
    return this.spotifyService.removeTracks(this.secondaryId, [action.trackUri]).pipe(
      flatMap(() => this.getSecondaryPlaylist(this.secondaryId)),
    ).subscribe();
  }

}
