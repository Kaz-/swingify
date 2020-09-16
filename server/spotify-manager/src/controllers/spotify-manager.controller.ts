import { Controller, Get, Logger, HttpService, Req, Post, Delete } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map, mergeMap, scan, expand, takeWhile } from 'rxjs/operators';

import { environment } from '../config/environment';
import { SpotifyManagerService } from '../services/spotify-manager.service';
import {
  SpotifyConfiguration,
  SpotifyUser,
  SpotifyPaging,
  SpotifyPlaylist,
  PlaylistTrack,
  SpotifyFeaturedPlaylists, AuthorizationToken, AuthorizeQueryOptions
} from '../models/spotify.models';

@Controller('spotify')
export class SpotifyManagerController {

  private logger = new Logger('Spotify Manager Controller');
  private accountsPath: string = environment.accountsPath;
  private baseApiUrl: string = environment.apiBaseUrl;

  constructor(
    private http: HttpService,
    private spotifyService: SpotifyManagerService
  ) { }

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    this.logger.log('Requesting Spotify configuration');
    return this.spotifyService.getSpotifyConfiguration();
  }

  @Get('verify')
  verify(@Req() request: Request): Observable<AuthorizationToken> {
    return this.getSpotifyConfiguration().pipe(
      mergeMap(config => {
        const options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
          },
          params: {
            grant_type: 'authorization_code',
            code: request.query.authorizationCode,
            redirect_uri: `${this.spotifyService.baseUrl}/process`
          }
        };
        return this.http.post<AuthorizationToken>(`${this.accountsPath}/api/token`, null, options);
      }),
      map(response => response.data)
    );
  }

  @Get('authorize')
  authorize(): Observable<string> {
    return this.getSpotifyConfiguration().pipe(
      map(config => {
        const options: AuthorizeQueryOptions = {
          responseType: 'code',
          clientId: config.clientId,
          redirectUri: escape(`${this.spotifyService.baseUrl}/process`),
          scope: 'playlist-modify-public',
          showDialog: true
        };
        return `${this.accountsPath}/authorize?client_id=${options.clientId}` +
          `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}&scope=${options.scope}&show_dialog=${options.showDialog}`;
      })
    );
  }

  @Get('me')
  getUserProfile(@Req() request: Request): Observable<SpotifyUser> {
    this.logger.log(`Requesting user's profile`);
    return this.http.get<SpotifyUser>(`${this.baseApiUrl}/me`, { headers: this.spotifyService.getAuthorizationHeader(request) })
      .pipe(map(response => response.data));
  }

  @Get('playlists')
  getPlaylists(@Req() request: Request): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.getUserProfile(request)
      .pipe(mergeMap(user => {
        this.logger.log(`Requesting playlists for user: ${user.id}`);
        return this.http.get<SpotifyPaging<SpotifyPlaylist>>(
          `${this.baseApiUrl}/users/${user.id}/playlists`,
          { headers: this.spotifyService.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
      }));
  }

  @Get('playlists/:id')
  getPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
    this.logger.log(`Requesting playlist with ID: ${request.params.id}`);
    return this.http.get<SpotifyPlaylist>(
      `${this.baseApiUrl}/playlists/${request.params.id}`,
      { headers: this.spotifyService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

  @Get('playlists/:id/tracks')
  getPlaylistTracks(@Req() request: Request): Observable<SpotifyPaging<PlaylistTrack>> {
    this.logger.log(`Requesting tracks from playlist: ${request.params.id}`);
    return this.spotifyService.getTracksByRequest(request).pipe(
      expand(tracks => this.spotifyService.getTracksByNext(tracks.next, this.spotifyService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(request.query.search) && Boolean(tracks.next), true),
      scan((prev, next) => ({ ...next, items: [...prev.items, ...next.items] })),
      map(tracks => request.query.search
        ? ({
          ...tracks,
          items: tracks.items.filter(item => this.spotifyService
            .findMatchInTrack(item, request.query.search.toString().toLowerCase().trim())),
          next: null
        }) : tracks
      )
    );
  }

  @Post('users/:id/playlists')
  createPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
    this.logger.log(`Creating a new playlist for user: ${request.params.id}`);
    return this.http.post<SpotifyPlaylist>(
      `${this.baseApiUrl}/users/${request.params.id}/playlists`, JSON.stringify(request.body),
      { headers: this.spotifyService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

  @Post('/playlists/:id')
  addTracks(@Req() request: Request): Observable<never> {
    this.logger.log(`Adding new tracks in: ${request.params.id}`);
    return request.query.from
      ? this.spotifyService.getTracksToAdd(request, request.query.from.toString())
      : this.spotifyService.addTracksByRequest(request);
  }

  @Delete('/playlists/:id')
  removeTracks(@Req() request: Request): Observable<never> {
    this.logger.log(`Removing tracks from: ${request.params.id}`);
    return request.query.from
      ? this.spotifyService.getTracksToRemove(request, request.query.from.toString())
      : this.spotifyService.removeTracksByRequest(request);
  }

  @Get('/featured')
  getFeaturedPlaylists(@Req() request: Request): Observable<SpotifyFeaturedPlaylists> {
    this.logger.log(`Requesting featured playlists with default locale`);
    return this.http.get<SpotifyFeaturedPlaylists>(
      `${this.baseApiUrl}/browse/featured-playlists`,
      { headers: this.spotifyService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

}
