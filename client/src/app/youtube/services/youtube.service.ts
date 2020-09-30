import { Inject, Injectable, LOCALE_ID, OnDestroy } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { catchError, scan, shareReplay, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../models/youtube.models';
import { ErrorService } from '../../shared/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService implements OnDestroy {

  private user: Subject<Details<Snippet>> = new Subject<Details<Snippet>>();
  user$: Observable<Details<Snippet>> = this.user.asObservable().pipe(shareReplay());

  private playlists: Subject<YoutubePaging<PlaylistOverview>> = new Subject<YoutubePaging<PlaylistOverview>>();
  playlists$: Observable<YoutubePaging<PlaylistOverview>> = this.playlists.asObservable().pipe(shareReplay());

  private playlistTracks: Subject<YoutubePaging<PlaylistItem>> = new Subject<YoutubePaging<PlaylistItem>>();
  playlistTracks$: Observable<YoutubePaging<PlaylistItem>> = this.playlistTracks.asObservable().pipe(
    scan((prev: YoutubePaging<PlaylistItem>, next: YoutubePaging<PlaylistItem>) => YoutubeService.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    this.subscriptions.push(
      this.updateUser(),
      this.updatePlaylists()
    );
  }

  static handleEmittedTracks(
    prev: YoutubePaging<PlaylistItem>,
    next: YoutubePaging<PlaylistItem>
  ): YoutubePaging<PlaylistItem> {
    const prevPlaylistId: string = prev?.items[0].snippet.playlistId;
    const nextPlaylistId: string = next?.items[0].snippet.playlistId;
    return prevPlaylistId === nextPlaylistId && next?.items.length > 0 && next?.fromNext
      ? { ...next, items: [...prev.items, ...next.items] } : next;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getUser(): Observable<Details<Snippet>> {
    return this.http.get<Details<Snippet>>(`${environment.youtube.userPath}/me`)
      .pipe(catchError(err => this.errorService.handleError(err)));
  }

  getPlaylists(): Observable<YoutubePaging<PlaylistOverview>> {
    return this.http.get<YoutubePaging<PlaylistOverview>>(`${environment.youtube.playlistsPath}`)
      .pipe(catchError(err => this.errorService.handleError(err)));
  }

  getPlaylistTracks(
    id: string,
    fromNext?: boolean,
    toNext?: string,
    query?: string
  ): Observable<YoutubePaging<PlaylistItem>> {
    return this.http.get<YoutubePaging<PlaylistItem>>(
      `${environment.youtube.playlistsPath}/${id}/tracks`,
      { params: this.createParams(toNext, query) }
    ).pipe(
      tap(tracks => tracks.fromNext = fromNext),
      tap(tracks => this.updatePlaylistTracks(tracks))
    );
  }

  updateUser(): Subscription {
    return this.getUser().subscribe(user => this.user.next(user));
  }

  updatePlaylists(): Subscription {
    return this.getPlaylists().subscribe(playlists => this.playlists.next(playlists));
  }

  updatePlaylistTracks(tracks: YoutubePaging<PlaylistItem>): void {
    this.playlistTracks.next(tracks);
  }

  private createParams(next?: string, query?: string): HttpParams {
    let params: HttpParams = new HttpParams();
    if (next) {
      params = params.append('next', btoa(next));
    }
    if (query) {
      params = params.append('search', query);
    }
    return params;
  }

  resetPlaylist(): void {
    this.updatePlaylistTracks(null);
  }

}
