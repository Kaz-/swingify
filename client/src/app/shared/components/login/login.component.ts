import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { AuthService as SpotifyAuthService } from '../../../spotify/services/auth.service';
import { AuthService as YoutubeAuthService } from '../../../youtube/services/auth.service';

import { AuthorizationToken } from '../../models/shared.models';

import { AuthPlatform } from '../../models/shared.models';

@Component({
  selector: 'swg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  version: string = environment.productVersion;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private spotifyAuthService: SpotifyAuthService,
    private youtubeAuthService: YoutubeAuthService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  redirect(platform: string): void {
    switch (platform) {
      case AuthPlatform.SPOTIFY:
        this.authenticateWithSpotify();
        break;
      case AuthPlatform.YOUTUBE:
        this.authenticateWithYoutube();
        break;
      default:
        break;
    }
  }

  private authenticateWithSpotify(): void {
    const token: AuthorizationToken = SpotifyAuthService.getToken();
    if (token) {
      SpotifyAuthService.isTokenExpired(token)
        ? this.subscriptions.push(this.spotifyAuthService.refresh(token).subscribe())
        : this.router.navigateByUrl('/spotify/home');
    } else {
      this.subscriptions.push(this.spotifyAuthService.authorize().subscribe());
    }
  }

  private authenticateWithYoutube(): void {
    const token: AuthorizationToken = YoutubeAuthService.getToken();
    token
      ? this.router.navigateByUrl('/youtube/home')
      : this.subscriptions.push(this.youtubeAuthService.authorize().subscribe());
  }

}
