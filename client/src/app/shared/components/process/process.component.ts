import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService as SpotifyAuthService } from '../../../spotify/services/auth.service';
import { AuthService as YoutubeAuthService } from '../../../youtube/services/auth.service';

import { AuthPlatform, AuthorizationToken } from '../../models/shared.models';

@Component({
  selector: 'swg-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private platform: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private youtubeAuthService: YoutubeAuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams
      .pipe(mergeMap(params => this.handle(params)))
      .subscribe(token => this.setTokenAccordingly(token));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handle(params: Params): Observable<AuthorizationToken> {
    this.platform = params.platform;
    switch (params.platform) {
      case AuthPlatform.SPOTIFY.toLowerCase():
        return this.authenticateWithSpotify(params);
      case AuthPlatform.YOUTUBE.toLowerCase():
        return this.authenticateWithYoutube(params);
      default:
        break;
    }
  }

  private authenticateWithSpotify(params: Params): Observable<AuthorizationToken> {
    return SpotifyAuthService.isAuthenticated()
      ? this.spotifyAuthService.verify(params.code, true)
      : this.spotifyAuthService.verify(params.code, false);
  }

  private authenticateWithYoutube(params: Params): Observable<AuthorizationToken> {
    return this.youtubeAuthService.verify(params.code);
  }

  private setTokenAccordingly(token: AuthorizationToken): void {
    switch (this.platform) {
      case AuthPlatform.SPOTIFY.toLowerCase():
        token.created_at = Math.round(Date.now() / 1000);
        SpotifyAuthService.isAuthenticated() ? SpotifyAuthService.setSecondaryToken(token) : SpotifyAuthService.setToken(token);
        break;
      case AuthPlatform.YOUTUBE.toLowerCase():
        YoutubeAuthService.setToken(token);
        break;
      default:
        break;
    }
    this.router.navigateByUrl('/spotify/home');
  }

}
