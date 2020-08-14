import { Component, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthService } from '../../services/auth.service';

import { AuthorizationToken, AuthorizeQueryOptions } from 'src/app/spotify/models/spotify.models';
import { AUTH_PLATFORMS } from '../../models/shared.models';

@Component({
  selector: 'exp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  redirect(platform: string): void {
    switch (platform) {
      case AUTH_PLATFORMS.Spotify:
        this.authenticateWithSpotify();
        break;
      case AUTH_PLATFORMS.YouTube:
        this.authenticateWithYoutube();
        break;
      default:
        break;
    }
  }

  private authenticateWithSpotify(): void {
    const token: AuthorizationToken = AuthService.getToken();
    if (token) {
      AuthService.isTokenExpired ? this.refresh(token) : this.router.navigateByUrl('/spotify/home');
    } else {
      this.authorize();
    }
  }

  private authenticateWithYoutube(): void {
    // TODO: implement YouTube authentication
  }

  private authorize(): void {
    this.subscriptions.push(this.getSpotifyConfiguration());
  }

  private refresh(token: AuthorizationToken): void {
    this.subscriptions.push(this.verify(token));
  }

  private getSpotifyConfiguration(): Subscription {
    return this.authService.getSpotifyConfiguration().subscribe(config => {
      const options: AuthorizeQueryOptions = {
        responseType: 'code',
        clientId: config.clientId,
        redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2Fprocess'
      };
      this.document.location.href = `${environment.spotify.accountsPath}/authorize?client_id=${options.clientId}` +
        `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}`;
    });
  }

  private verify(token: AuthorizationToken): Subscription {
    return this.authService.verify(token.refresh_token)
      .subscribe(refreshedToken => {
        token.created_at = Date.now() / 1000; // in seconds
        AuthService.setToken(refreshedToken);
      }, () => {
        AuthService.removeToken();
        this.authorize();
      });
  }

}
