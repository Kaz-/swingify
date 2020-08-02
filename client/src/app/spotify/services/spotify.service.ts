import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { SpotifyEnvironment } from '../models/spotify.models';

@Injectable()
export class SpotifyService {

  constructor(private http: HttpClient) { }

  getSpotifyEnvironment(): Observable<SpotifyEnvironment> {
    return this.http.get<SpotifyEnvironment>(`${environment.spotify.serverPath}/environment`);
  }

  verify(authorizationCode: string, clientId: string, clientSecret: string): Observable<any> {
    const body = {
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: 'http%3A%2F%2Flocalhost%3A4200%2Fspotify%2Fexport',
      client_id: clientId,
      client_secret: clientSecret
    };
    const headers = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return this.http.post<any>(`${environment.spotify.accountsPath}/api/token`, body, headers);
  }

}
