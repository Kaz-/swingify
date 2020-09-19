import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, mergeMap, scan, shareReplay } from 'rxjs/operators';

import { SpotifyService } from './spotify.service';
import { SpotifyPaging, PlaylistTrack, SpotifyPlaylist, SavedTrack } from '../models/spotify.models';

@Injectable({
  providedIn: 'root'
})
export class PrimaryService {

  primaryPlaylist: Subject<SpotifyPlaylist> = new Subject<SpotifyPlaylist>();
  primaryPlaylist$: Observable<SpotifyPlaylist> = this.primaryPlaylist.asObservable().pipe(shareReplay());
  primaryPlaylistTracks: Subject<SpotifyPaging<PlaylistTrack>> = new Subject<SpotifyPaging<PlaylistTrack>>();
  primaryPlaylistTracks$: Observable<SpotifyPaging<PlaylistTrack>> = this.primaryPlaylistTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<PlaylistTrack>, next: SpotifyPaging<PlaylistTrack>) => SpotifyService.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  primarySavedTracks: Subject<SpotifyPaging<SavedTrack>> = new Subject<SpotifyPaging<SavedTrack>>();
  primarySavedTracks$: Observable<SpotifyPaging<SavedTrack>> = this.primarySavedTracks.asObservable().pipe(
    scan((prev: SpotifyPaging<SavedTrack>, next: SpotifyPaging<SavedTrack>) => SpotifyService.handleEmittedTracks(prev, next)),
    shareReplay()
  );

  constructor(private spotifyService: SpotifyService) { }

  getPrimaryPlaylist(id: string, fromNext?: boolean): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylist(id, false).pipe(
      tap(playlist => this.updatePrimaryPlaylist(playlist)),
      mergeMap(playlist => this.getPrimaryPlaylistTracks(playlist.id, fromNext))
    );
  }

  getPrimaryPlaylistTracks(
    id: string,
    fromNext?: boolean,
    toNext?: string,
    query?: string
  ): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.spotifyService.getPlaylistTracks(id, false, toNext, query).pipe(
      tap(tracks => tracks.parentId = id),
      tap(tracks => tracks.fromNext = fromNext),
      tap(tracks => this.updatePrimaryPlaylistTracks(tracks))
    );
  }

  updatePrimaryPlaylist(playlist: SpotifyPlaylist | null): void {
    this.primaryPlaylist.next(playlist);
  }

  private updatePrimaryPlaylistTracks(tracks: SpotifyPaging<PlaylistTrack>): void {
    this.primaryPlaylistTracks.next(tracks);
    this.primarySavedTracks.next(null); // force switch from 'liked playlist' to playlist
  }

  getPrimarySavedTracks(
    fromNext?: boolean,
    toNext?: string,
    query?: string
  ): Observable<SpotifyPaging<SavedTrack>> {
    return this.spotifyService.getSavedTracks(false, toNext, query).pipe(
      tap(tracks => tracks.parentId = 'liked'),
      tap(tracks => tracks.fromNext = fromNext),
      tap(tracks => this.updatePrimarySavedTracks(tracks))
    );
  }

  updatePrimarySavedTracks(tracks: SpotifyPaging<SavedTrack> | null): void {
    this.primarySavedTracks.next(tracks);
    this.primaryPlaylist.next(null); // force switch from playlist to 'liked playlist'
  }

}
