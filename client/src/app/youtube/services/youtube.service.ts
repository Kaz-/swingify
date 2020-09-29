import { Inject, Injectable, LOCALE_ID, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Details, PlaylistOverview, Snippet, YoutubePaging } from '../models/youtube.models';
import { ErrorService } from '../../shared/services/error.service';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService implements OnDestroy {

  private user: Subject<Details<Snippet>> = new Subject<Details<Snippet>>();
  user$: Observable<Details<Snippet>> = this.user.asObservable().pipe(shareReplay());
  private playlists: Subject<YoutubePaging<PlaylistOverview>> = new Subject<YoutubePaging<PlaylistOverview>>();
  playlists$: Observable<YoutubePaging<PlaylistOverview>> = this.playlists.asObservable().pipe(shareReplay());

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

  updateUser(): Subscription {
    return this.getUser().subscribe(user => this.user.next(user));
  }

  updatePlaylists(): Subscription {
    return this.getPlaylists().subscribe(playlists => this.playlists.next(playlists));
  }

}
