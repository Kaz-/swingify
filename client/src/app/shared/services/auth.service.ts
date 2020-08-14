import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthorizationToken, SpotifyConfiguration, AuthorizeQueryOptions } from 'src/app/spotify/models/spotify.models';

@Injectable()
export class AuthService implements OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  static setToken(token: AuthorizationToken): void {
    localStorage.setItem('primary_spotify_token', JSON.stringify(token));
  }

  static setSecondaryToken(token: AuthorizationToken): void {
    localStorage.setItem('secondary_spotify_token', JSON.stringify(token));
  }

  static getToken(): AuthorizationToken {
    return JSON.parse(localStorage.getItem('primary_spotify_token'));
  }

  static getSecondaryToken(): AuthorizationToken {
    return JSON.parse(localStorage.getItem('secondary_spotify_token'));
  }

  static removeToken(): void {
    localStorage.removeItem('primary_spotify_token');
  }

  static removeSecondaryToken(): void {
    localStorage.removeItem('secondary_spotify_token');
  }

  static isTokenExpired(token: AuthorizationToken): boolean {
    const expirationDate: number = token.created_at + token.expires_in;
    const current: number = Date.now() / 1000;
    return current > expirationDate;
  }

  static isAuthenticated(): boolean {
    const token = AuthService.getToken();
    return token && !AuthService.isTokenExpired(token);
  }

  static isSecondaryAuthenticated(): boolean {
    const token = AuthService.getSecondaryToken();
    return token && !AuthService.isTokenExpired(token);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    return this.http.get<SpotifyConfiguration>(`${environment.spotify.serverPath}/configuration`);
  }

  verify(authorizationCode: string, isSecondary: boolean): Observable<AuthorizationToken> {
    return this.getSpotifyConfiguration()
      .pipe(switchMap(config => {
        const options = {
          headers: {
            Secondary: isSecondary ? 'true' : 'false',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
          },
          params: {
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: 'http://localhost:4200/process'
          }
        };
        return this.http.post<AuthorizationToken>(`${environment.spotify.accountsPath}/api/token`, null, options);
      }));
  }

  authorize(): void {
    this.subscriptions.push(this._authorize());
  }

  refresh(token: AuthorizationToken): void {
    this.subscriptions.push(this._refresh(token));
  }

  private _authorize(): Subscription {
    return this.getSpotifyConfiguration().subscribe(config => {
      const options: AuthorizeQueryOptions = {
        responseType: 'code',
        clientId: config.clientId,
        redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2Fprocess',
        scope: 'playlist-modify-public'
      };
      this.document.location.href = `${environment.spotify.accountsPath}/authorize?client_id=${options.clientId}` +
        `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}&scope=${options.scope}`;
    });
  }

  private _refresh(token: AuthorizationToken): Subscription {
    return this.verify(token.refresh_token, false)
      .subscribe(refreshedToken => {
        token.created_at = Date.now() / 1000; // in seconds
        AuthService.setToken(refreshedToken);
      }, () => {
        AuthService.removeToken();
        this.authorize();
      });
  }

}
