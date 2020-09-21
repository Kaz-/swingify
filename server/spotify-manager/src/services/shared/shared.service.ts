import { HttpService, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request } from 'express';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from '../../config/config.service';
import { environment } from '../../config/environment';
import { PlaylistTrack, SavedTrack, SpotifyConfiguration, SpotifyPaging, SpotifyUser } from '../../models/spotify.models';

@Injectable()
export class SharedService {

  private client: ClientProxy;

  constructor(
    private http: HttpService,
    private configService: ConfigService
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: this.configService.proxyConf
    });
  }

  get baseUrl(): string {
    return this.configService.baseUrl;
  }

  static getAuthorizationHeader(request: Request): any {
    return {
      Authorization: request.headers['authorization'] ? request.headers['authorization'] : null,
      'Content-Type': 'application/json'
    };
  }

  static toggleClosingBuffer(tracks: SpotifyPaging<PlaylistTrack | SavedTrack>, closingEvent: Subject<boolean>): void {
    if (!tracks.next && !tracks.previous) {
      closingEvent.next(true);
    }
  }

  static findMatchInTrack(item: PlaylistTrack | SavedTrack, query: string): boolean {
    return item.track.name.toLowerCase().trim().includes(query)
      || item.track.album.name.toLowerCase().trim().includes(query)
      || SharedService.findMatchInArtists(item, query);
  }

  private static findMatchInArtists(item: PlaylistTrack | SavedTrack, query: string): boolean {
    return item.track.artists.some(artist => artist.name.toLowerCase().trim().includes(query));
  }

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    // Sending empty string because there is no need to send any data
    return this.client.send('spotifyConfiguration', '');
  }

  getUserProfile(request: Request): Observable<SpotifyUser> {
    return this.http.get<SpotifyUser>(`${environment.apiBaseUrl}/me`, { headers: SharedService.getAuthorizationHeader(request) })
      .pipe(map(response => response.data));
  }

}
