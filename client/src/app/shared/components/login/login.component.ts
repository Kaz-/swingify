import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { AuthorizationToken } from 'src/app/spotify/models/spotify.models';
import { AUTH_PLATFORMS } from '../../models/shared.models';

@Component({
  selector: 'exp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

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
      AuthService.isTokenExpired ? this.authService.refresh(token) : this.router.navigateByUrl('/spotify/home');
    } else {
      this.authService.authorize();
    }
  }

  private authenticateWithYoutube(): void {
    // TODO: implement YouTube authentication
  }

}
