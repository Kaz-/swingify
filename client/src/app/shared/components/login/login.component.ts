import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { SpotifyAuthService } from '../../services/spotify-auth.service';
import { YoutubeAuthService } from '../../services/youtube-auth.service';

import { AuthorizationToken, AuthPlatform } from '../../models/shared.models';

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
    if (token) {
      console.log(YoutubeAuthService.isTokenExpired(token));
      YoutubeAuthService.isTokenExpired(token)
        ? this.subscriptions.push(this.youtubeAuthService.refresh(token).subscribe())
        : this.router.navigateByUrl('/youtube/home');
    } else {
      this.subscriptions.push(this.youtubeAuthService.authorize().subscribe());
    }
  }

}
