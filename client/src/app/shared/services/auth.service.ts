import { Injectable, Inject, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, catchError, mergeMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthorizationToken, SpotifyConfiguration } from 'src/app/spotify/models/spotify.models';
import { ErrorService } from './error.service';

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private router: Router,
    private sanitizer: DomSanitizer,
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
    return this.http.get<AuthorizationToken>(
      `${environment.spotify.serverPath}/verify`,
      { params: new HttpParams().set('authorizationCode', authorizationCode) }
    ).pipe(
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
    return this.http.get<string>(`${environment.spotify.serverPath}/authorize`, { responseType: 'text' as 'json' })
      .pipe(
        mergeMap(redirection => {
          this.document.location.href = this.sanitizer.sanitize(SecurityContext.URL, redirection);
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
