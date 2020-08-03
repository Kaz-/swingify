import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { SpotifyConfiguration, AuthorizationToken } from '../models/spotify.models';

@Injectable()
export class SpotifyService {

  constructor(private http: HttpClient) { }

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
            redirect_uri: 'http://localhost:4200/spotify/process'
          }
        };
        return this.http.post<AuthorizationToken>(`${environment.spotify.accountsPath}/api/token`, null, options);
      }));
  }

}
