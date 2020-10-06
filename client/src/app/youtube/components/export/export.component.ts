import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { YoutubeAuthService } from '../../../shared/services/youtube-auth.service';
import { SpotifyAuthService } from '../../../shared/services/spotify-auth.service';
import { YoutubeService } from '../../services/youtube.service';
import { SecondaryService } from '../../../spotify/services/secondary.service';

import { Details, Snippet, YoutubePaging, PlaylistOverview, PlaylistItem } from '../../models/youtube.models';
import { SpotifyUser, SpotifyPaging, SpotifyPlaylist, PlaylistTrack, SavedTrack } from '../../../spotify/models/spotify.models';

@Component({
  selector: 'swg-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private youtubeService: YoutubeService,
    private secondaryService: SecondaryService
  ) { }

  ngOnInit(): void {
    if (this.isSecondaryAuthenticated()) {
      this.subscriptions.push(
        this.secondaryService.updateSecondaryUser(),
        this.secondaryService.updateSecondaryPlaylists()
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.youtubeService.resetPlaylist();
    this.secondaryService.resetSecondary();
  }

  /**
   * Returns the current primary user
   */
  get primaryUser$(): Observable<Details<Snippet>> {
    return this.youtubeService.user$;
  }

  /**
   * Returns all primary playlists
   */
  get primaryPlaylists$(): Observable<YoutubePaging<PlaylistOverview>> {
    return this.youtubeService.playlists$;
  }

  /**
   * Returns a single primary playlist
   */
  get primaryPlaylist$(): Observable<Details<PlaylistOverview>> {
    return this.youtubeService.playlist$;
  }

  /**
   * Returns all tracks from a primary playlist
   */
  get primaryPlaylistTracks$(): Observable<YoutubePaging<PlaylistItem>> {
    return this.youtubeService.playlistTracks$;
  }

  /**
   * Returns the current secondary user
   */
  get secondaryUser$(): Observable<SpotifyUser> {
    return this.secondaryService.secondaryUser$;
  }

  /**
   * Returns all secondary playlists
   */
  get secondaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.secondaryService.secondaryPlaylists$;
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

  isAuthenticated(): boolean {
    return YoutubeAuthService.isAuthenticated();
  }

  isSecondaryAuthenticated(): boolean {
    return SpotifyAuthService.isSecondaryAuthenticated();
  }

}
