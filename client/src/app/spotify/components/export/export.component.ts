import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';
import { PrimaryService } from '../../services/primary.service';
import { SecondaryService } from '../../services/secondary.service';

import { SpotifyPlaylist, SpotifyUser, SpotifyPaging, PlaylistTrack, SavedTrack } from '../../models/spotify.models';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'swg-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private toastr: ToastrService,
    private spotifyService: SpotifyService,
    private primaryService: PrimaryService,
    private secondaryService: SecondaryService
  ) { }

  ngOnInit(): void {
    if (this.isSecondaryAuthenticated()) {
      this.subscriptions.push(
        this.spotifyService.updateUser(true),
        this.spotifyService.updatePlaylists(true)
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.primaryService.resetPrimary();
    this.secondaryService.resetSecondary();
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

  isAuthenticated(): boolean {
    return AuthService.isAuthenticated();
  }

  isSecondaryAuthenticated(): boolean {
    return AuthService.isSecondaryAuthenticated();
  }

  getHelp(): string {
    return 'If you want to share your playlist, you can click\n' +
      'on this button or directly copy the URL from\n' +
      'your browser with the "p" parameter only.\n' +
      'Also make sure that your playlist is public.';
  }

  share(): void {
    const url: string = window.location.href;
    const dummy = document.createElement('input');
    dummy.value = url.split('s=')[0]; // remove secondary part
    document.body.appendChild(dummy);
    dummy.focus();
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    this.toastr.info('Copied to clipboard!', null, { progressBar: true, timeOut: 2000 });
  }

}
