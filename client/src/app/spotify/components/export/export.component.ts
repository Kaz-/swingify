import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, shareReplay } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { SpotifyPlaylist, PlaylistCreation } from '../../models/spotify.models';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  primaryPlaylist$: Observable<SpotifyPlaylist>;
  secondaryPlaylist$: Observable<SpotifyPlaylist>;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.primaryPlaylist$ = this.initPrimaryPlaylist();
    this.secondaryPlaylist$ = this.initSecondaryPlaylist();
  }

  private initPrimaryPlaylist(): Observable<SpotifyPlaylist> {
    return this.route.params.pipe(
      flatMap(params => this.spotifyService.getPlaylist(params.primary, false)),
      shareReplay()
    );
  }

  private initSecondaryPlaylist(): Observable<SpotifyPlaylist> {
    if (AuthService.isSecondaryAuthenticated()) {
      return this.spotifyService.getUser(true).pipe(
        flatMap(user => this.primaryPlaylist$.pipe(
          flatMap(playlist => {
            const creation: PlaylistCreation = { name: playlist.name };
            return this.spotifyService.createPlaylist(user.id, creation, true);
          })
        )),
        shareReplay()
      );
    }
  }

  isLargeScreen(): boolean {
    return window.screen.width > 1280;
  }

  isSecondaryAuthenticated(): boolean {
    return AuthService.isSecondaryAuthenticated();
  }

  authenticate(): void {
    this.authService.authorize();
  }

}
