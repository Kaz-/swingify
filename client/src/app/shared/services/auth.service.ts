import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthorizationToken, SpotifyConfiguration } from 'src/app/spotify/models/spotify.models';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

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

  verify(authorizationCode: string): Observable<AuthorizationToken> {
    return this.getSpotifyConfiguration()
      .pipe(switchMap(config => {
        const options = {
          headers: {
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

}
