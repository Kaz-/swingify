import { HttpService, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request } from 'express';

import { Observable, Subject } from 'rxjs';
import { expand, map, takeWhile } from 'rxjs/operators';

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

  getTracksByRequest(request: Request, from?: string, limit?: number): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(
      request.query.next
        ? Buffer.from(request.query.next.toString(), 'base64').toString()
        : `${environment.apiBaseUrl}/playlists/${from ? from : request.params.id}/tracks?offset=0&limit=${limit ? limit : 100}`,
      { headers: SharedService.getAuthorizationHeader(request) }).pipe(map(response => response.data));
  }

  getSavedTracksByRequest(request: Request): Observable<SpotifyPaging<SavedTrack>> {
    return this.http.get<SpotifyPaging<SavedTrack>>(
      request.query.next
        ? Buffer.from(request.query.next.toString(), 'base64').toString()
        : `${environment.apiBaseUrl}/me/tracks?offset=0&limit=50`,
      { headers: SharedService.getAuthorizationHeader(request) }).pipe(map(response => response.data));
  }

  getTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.http.get<SpotifyPaging<PlaylistTrack>>(next, { headers: authorization })
      .pipe(map(response => response.data));
  }

  getSavedTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<SavedTrack>> {
    return this.http.get<SpotifyPaging<SavedTrack>>(next, { headers: authorization })
      .pipe(map(response => response.data));
  }

  getCompleteTracklist(request: Request, from?: string, limit?: number): Observable<SpotifyPaging<PlaylistTrack>> {
    return this.getTracksByRequest(request, from, limit).pipe(
      expand(tracks => this.getTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(tracks.next), true)
    );
  }

  getCompleteSavedTracklist(request: Request): Observable<SpotifyPaging<SavedTrack>> {
    return this.getSavedTracksByRequest(request).pipe(
      expand(tracks => this.getSavedTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(tracks.next), true)
    );
  }

}
