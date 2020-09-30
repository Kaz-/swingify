import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SpotifyPlaylist, SpotifyPaging, PlaylistTrack, SavedTrack, SpotifyUser } from '../../../spotify/models/spotify.models';
import { SecondaryService } from '../../../spotify/services/secondary.service';
import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../../../youtube/models/youtube.models';
import { YoutubeService } from '../../../youtube/services/youtube.service';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'swg-export-wrapper',
  templateUrl: './export-wrapper.component.html',
  styleUrls: ['./export-wrapper.component.scss']
})
export class ExportWrapperComponent implements OnInit, OnDestroy {

  // private subscriptions: Subscription[] = [];

  // constructor(
  //   private router: Router,
  //   private toastr: ToastrService,
  //   private youtubeService: YoutubeService,
  //   private secondaryService: SecondaryService
  // ) { }

  // ngOnInit(): void {
  //   if (this.isSecondaryAuthenticated()) {
  //     this.subscriptions.push(
  //       this.secondaryService.updateUser(),
  //       this.secondaryService.updatePlaylists()
  //     );
  //   }
  // }

  // ngOnDestroy(): void {
  //   this.subscriptions.forEach(subscription => subscription.unsubscribe());
  //   this.youtubeService.resetPlaylist();
  //   this.secondaryService.resetSecondary();
  // }

  // /**
  //  * Returns the current primary user
  //  */
  // get primaryUser$(): Observable<Details<Snippet>> {
  //   return this.youtubeService.user$;
  // }

  // /**
  //  * Returns all primary playlists
  //  */
  // get primaryPlaylists$(): Observable<YoutubePaging<PlaylistOverview>> {
  //   return this.youtubeService.playlists$;
  // }

  // /**
  //  * Returns all tracks from a primary playlist
  //  */
  // get primaryPlaylistTracks$(): Observable<YoutubePaging<PlaylistItem>> {
  //   return this.youtubeService.playlistTracks$;
  // }

  // /**
  //  * Returns the current secondary user
  //  */
  // get secondaryUser$(): Observable<SpotifyUser> {
  //   return this.secondaryService.user$;
  // }

  // /**
  //  * Returns all secondary playlists
  //  */
  // get secondaryPlaylists$(): Observable<SpotifyPaging<SpotifyPlaylist>> {
  //   return this.secondaryService.playlists$;
  // }

  // /**
  //  * Returns a single secondary playlist
  //  */
  // get secondaryPlaylist$(): Observable<SpotifyPlaylist> {
  //   return this.secondaryService.secondaryPlaylist$;
  // }

  // /**
  //  * Returns all tracks from a secondary playlist
  //  */
  // get secondaryPlaylistTracks$(): Observable<SpotifyPaging<PlaylistTrack>> {
  //   return this.secondaryService.secondaryPlaylistTracks$;
  // }

  // /**
  //  * Returns all saved tracks from secondary user
  //  */
  // get secondarySavedTracks$(): Observable<SpotifyPaging<SavedTrack>> {
  //   return this.secondaryService.secondarySavedTracks$;
  // }

  // isAuthenticated(): boolean {
  //   return SpotifyAuthService.isAuthenticated();
  // }

  // isSecondaryAuthenticated(): boolean {
  //   return SpotifyAuthService.isSecondaryAuthenticated();
  // }

  // getHelp(): string {
  //   return 'If you want to share your playlist, you can click\n' +
  //     'on this button or directly copy the URL from\n' +
  //     'your browser with the "p" parameter only.\n' +
  //     'Also make sure that your playlist is public.';
  // }

  // share(): void {
  //   const dummy = document.createElement('input');
  //   const url: UrlTree = this.router.parseUrl(this.router.url);
  //   url.queryParams = { p: url.queryParams.p }; // remove secondary part
  //   dummy.value = `${environment.baseUrl}${this.router.serializeUrl(url)}`;
  //   document.body.appendChild(dummy);
  //   dummy.focus();
  //   dummy.select();
  //   document.execCommand('copy');
  //   document.body.removeChild(dummy);
  //   this.toastr.info('Copied to clipboard!', null, { progressBar: true, timeOut: 2000 });
  // }

}
