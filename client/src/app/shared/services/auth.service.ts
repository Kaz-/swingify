import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthorizationToken, SpotifyConfiguration, AuthorizeQueryOptions } from 'src/app/spotify/models/spotify.models';
import { ErrorService } from './error.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private router: Router,
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

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    return this.http.get<SpotifyConfiguration>(`${environment.spotify.serverPath}/configuration`);
  }

  verify(authorizationCode: string, isSecondary: boolean): Observable<AuthorizationToken> {
    return this.getSpotifyConfiguration().pipe(
      switchMap(config => {
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
      }),
      catchError(() => {
        if (isSecondary) {
          AuthService.removeSecondaryToken();
          this.router.navigateByUrl('/spotify/export');
        } else {
          AuthService.removeToken();
          this.router.navigateByUrl('/login');
        }
        return EMPTY;
      })
    );
  }

  authorize(): Observable<never> {
    return this.getSpotifyConfiguration().pipe(
      switchMap(config => {
        const options: AuthorizeQueryOptions = {
          responseType: 'code',
          clientId: config.clientId,
          redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2Fprocess',
          scope: 'playlist-modify-public',
          showDialog: true
        };
        this.document.location.href = `${environment.spotify.accountsPath}/authorize?client_id=${options.clientId}` +
          `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}&scope=${options.scope}&show_dialog=${options.showDialog}`;
        return EMPTY;
      }),
      catchError(err => this.errorService.handleError(err))
    );
  }

  refresh(token: AuthorizationToken): Observable<never> {
    return this.verify(token.refresh_token, false).pipe(
      switchMap(refreshedToken => {
        token.created_at = Date.now() / 1000; // in seconds
        AuthService.setToken(refreshedToken);
        return EMPTY;
      }),
      catchError(() => {
        AuthService.removeToken();
        return this.authorize();
      })
    );
  }

}
