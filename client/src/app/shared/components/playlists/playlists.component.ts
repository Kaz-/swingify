import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SpotifyPaging, SpotifyPlaylist, PlaylistCreation, SpotifyUser } from 'src/app/spotify/models/spotify.models';
import { DialogInput } from '../../models/shared.models';
import { SpotifyService } from 'src/app/spotify/services/spotify.service';

@Component({
  selector: 'exp-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<SpotifyUser>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() isSecondary?: boolean;

  subscriptions: Subscription[] = [];
  dialog: DialogInput;
  isCreating: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    this.subscriptions.push(this.route.queryParams.pipe(
      flatMap(params => this.router.navigate(
        ['/spotify/export', playlistId],
        { queryParams: { secondary: params.secondary } })
      )
    ).subscribe());
  }

  secondaryNavigate(playlistId: string): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { secondary: playlistId } });
  }

  onCreate(name: string, user: string): void {
    const playlist: PlaylistCreation = { name };
    this.subscriptions.push(this.spotifyService.createPlaylist(user, playlist, this.isSecondary)
      .subscribe(() => {
        this.spotifyService.updatePlaylists(this.isSecondary);
        this.isCreating = false;
      }));
  }

}
