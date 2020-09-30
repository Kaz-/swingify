import { Injectable } from '@angular/core';
import { Observable, EMPTY, Subject } from 'rxjs';
import { tap, mergeMap, scan, shareReplay, distinctUntilChanged } from 'rxjs/operators';

import { SpotifyService } from './spotify.service';
import { SpotifyPaging, PlaylistTrack, SpotifyPlaylist, SavedTrack, LIKED_ID } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class SecondaryService {

  private secondaryPlaylist: Subject<SpotifyPlaylist> = new Subject<SpotifyPlaylist>();
  secondaryPlaylist$: Observable<SpotifyPlaylist> = this.secondaryPlaylist.asObservable().pipe(shareReplay());

  private secondaryPlaylistTracks: Subject<SpotifyPaging<PlaylistTrack>> = new Subject<SpotifyPaging<PlaylistTrack>>();
  secondaryPlaylistTracks$: Observable<SpotifyPaging<PlaylistTrack>> = this.secondaryPlaylistTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<PlaylistTrack>, next: SpotifyPaging<PlaylistTrack>) => SpotifyService.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  private secondarySavedTracks: Subject<SpotifyPaging<SavedTrack>> = new Subject<SpotifyPaging<SavedTrack>>();
  secondarySavedTracks$: Observable<SpotifyPaging<SavedTrack>> = this.secondarySavedTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<SavedTrack>, next: SpotifyPaging<SavedTrack>) => SpotifyService.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  constructor(private spotifyService: SpotifyService) { }

  getSecondaryPlaylist(id: string, fromNext?: boolean): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylist(id, true).pipe(
      tap(playlist => this.updateSecondaryPlaylist(playlist)),
      mergeMap(playlist => playlist ? this.getSecondaryPlaylistTracks(playlist.id, fromNext) : EMPTY),
      distinctUntilChanged()
    );
  }

  getSecondaryPlaylistTracks(
    id: string,
    fromNext?: boolean,
    toNext?: string,
    query?: string
  ): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylistTracks(id, true, toNext, query).pipe(
      tap(tracks => tracks.parentId = id),
      tap(tracks => tracks.fromNext = fromNext),
      tap(tracks => this.updateSecondaryPlaylistTracks(tracks))
    );
  }

  updateSecondaryPlaylist(playlist: SpotifyPlaylist | null): void {
    this.secondaryPlaylist.next(playlist);
  }

  private updateSecondaryPlaylistTracks(tracks: SpotifyPaging<PlaylistTrack>): void {
    this.secondaryPlaylistTracks.next(tracks);
    this.secondarySavedTracks.next(null); // force switch from 'liked playlist' to playlist
  }

  getsecondarySavedTracks(
    fromNext?: boolean,
    toNext?: string,
    query?: string
  ): Observable<SpotifyPaging<SavedTrack>> {
    return this.spotifyService.getSavedTracks(true, toNext, query).pipe(
      tap(tracks => tracks.parentId = LIKED_ID),
      tap(tracks => tracks.fromNext = fromNext),
      tap(tracks => this.updateSecondarySavedTracks(tracks))
    );
  }

  updateSecondarySavedTracks(tracks: SpotifyPaging<SavedTrack> | null): void {
    this.secondarySavedTracks.next(tracks);
    this.secondaryPlaylist.next(null); // force switch from playlist to 'liked playlist'
  }

  resetSecondary(): void {
    this.updateSecondaryPlaylist(null);
    this.updateSecondaryPlaylistTracks(null);
    this.updateSecondarySavedTracks(null);
  }

}
