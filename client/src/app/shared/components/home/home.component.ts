import { Component, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { AuthorizeQueryOptions, AuthorizationToken } from 'src/app/spotify/models/spotify.models';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'exp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private spotifyService: SpotifyService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  redirect(): void {
    const token: AuthorizationToken = SpotifyService.getToken();
    if (token) {
      SpotifyService.isTokenExpired ? this.refresh(token) : this.router.navigateByUrl('/export');
    } else {
      this.authorize();
    }
  }

  private authorize(): void {
    this.subscriptions.push(
      this.spotifyService.getSpotifyConfiguration().subscribe(config => {
        const options: AuthorizeQueryOptions = {
          responseType: 'code',
          clientId: config.clientId,
          redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2Fspotify%2Fprocess'
        };
        this.document.location.href = `${environment.spotify.accountsPath}/authorize?client_id=${options.clientId}` +
          `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}`;
      })
    );
  }

  private refresh(token: AuthorizationToken): void {
    this.subscriptions.push(
      this.spotifyService.verify(token.refresh_token)
        .subscribe(refreshedToken => {
          token.created_at = Date.now() / 1000; // in seconds
          SpotifyService.setToken(refreshedToken);
        }, () => this.authorize())
    );
  }

}
