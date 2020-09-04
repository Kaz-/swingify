import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { SpotifyPaging, SpotifyPlaylist, PlaylistCreation, SpotifyUser } from 'src/app/spotify/models/spotify.models';
import { DialogInput } from '../../models/shared.models';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() allowCreation?: boolean;
  @Input() user$: Observable<SpotifyUser>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() isSecondary: boolean;

  subscriptions: Subscription[] = [];
  dialog: DialogInput;
  isCreating: boolean;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.dialog = {
      title: 'Create a playlist',
      label: `Playlist's name`,
      placeholder: 'New playlist',
      action: 'Create'
    };
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  navigate(playlistId: string): void {
    this.isSecondary ? this.secondaryNavigate(playlistId) : this.primaryNavigate(playlistId);
  }

  primaryNavigate(playlistId: string): void {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams
      ? this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId, s: tree.queryParams.s } })
      : this.router.navigate(['/spotify/export'], { queryParams: { p: playlistId } });
  }

  secondaryNavigate(playlistId: string): void {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    tree.queryParams
      ? this.router.navigate(['/spotify/export'], { queryParams: { p: tree.queryParams.p, s: playlistId } })
      : this.router.navigate(['/spotify/export'], { queryParams: { s: playlistId } });
  }

  onCreate(name: string, user: string): void {
    const playlist: PlaylistCreation = { name };
    this.subscriptions.push(this.spotifyService.createPlaylist(user, playlist, this.isSecondary)
      .subscribe(() => {
        this.spotifyService.updatePlaylists(this.isSecondary);
        this.isCreating = false;
        this.toastr.success('Playlist was successfully created!', null, { progressBar: true, timeOut: 2000 });
      }));
  }

}
