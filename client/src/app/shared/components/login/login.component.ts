import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

import { AuthorizationToken } from 'src/app/spotify/models/spotify.models';
import { AuthPlatform } from '../../models/shared.models';

@Component({
  selector: 'exp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
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
    const token: AuthorizationToken = AuthService.getToken();
    if (token) {
      AuthService.isTokenExpired(token)
        ? this.subscriptions.push(this.authService.refresh(token).subscribe())
        : this.router.navigateByUrl('/spotify/home');
    } else {
      this.subscriptions.push(this.authService.authorize().subscribe());
    }
  }

  private authenticateWithYoutube(): void {
    // TODO: implement YouTube authentication
  }

}
