import { Controller, Delete, Get, HttpService, Logger, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { mergeMap, map, expand, takeWhile, scan } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { SpotifyPaging, SpotifyPlaylist, PlaylistTrack, SpotifyFeaturedPlaylists } from '../../models/spotify.models';
import { PlaylistsService } from '../../services/playlists.service';
import { SharedService } from '../../services/shared.service';

@Controller('playlists')
export class PlaylistsController {

  private logger = new Logger('Playlists Controller');

  constructor(
    private http: HttpService,
    private sharedService: SharedService,
    private playlistsService: PlaylistsService
  ) { }

  @Get()
  getPlaylists(@Req() request: Request): Observable<SpotifyPaging<SpotifyPlaylist>> {
    return this.sharedService.getUserProfile(request)
      .pipe(mergeMap(user => {
        this.logger.log(`Requesting playlists for user: ${user.id}`);
        return this.http.get<SpotifyPaging<SpotifyPlaylist>>(
          `${environment.apiBaseUrl}/users/${user.id}/playlists`,
          { headers: SharedService.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
      }));
  }

  @Get(':id')
  getPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
    this.logger.log(`Requesting playlist with ID: ${request.params.id}`);
    return this.http.get<SpotifyPlaylist>(
      `${environment.apiBaseUrl}/playlists/${request.params.id}`,
      { headers: SharedService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

  @Get(':id/tracks')
  getPlaylistTracks(@Req() request: Request): Observable<SpotifyPaging<PlaylistTrack>> {
    this.logger.log(`Requesting tracks from playlist: ${request.params.id}`);
    return this.sharedService.getTracksByRequest(request).pipe(
      expand(tracks => this.sharedService.getTracksByNext(tracks.next, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(request.query.search) && Boolean(tracks.next), true),
      scan((prev, next) => ({ ...next, items: [...prev.items, ...next.items] })),
      map(tracks => request.query.search
        ? ({
          ...tracks,
          items: tracks.items.filter(item => SharedService.findMatchInTrack(item, request.query.search.toString().toLowerCase().trim())),
          next: null
        }) : tracks
      )
    );
  }

  @Post('create/:userId')
  createPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
    this.logger.log(`Creating a new playlist for user: ${request.params.userId}`);
    return this.http.post<SpotifyPlaylist>(
      `${environment.apiBaseUrl}/users/${request.params.userId}/playlists`, JSON.stringify(request.body),
      { headers: SharedService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

  @Post(':id')
  addTracks(@Req() request: Request): Observable<never> {
    this.logger.log(`Adding new tracks in: ${request.params.id}`);
    return request.query.from
      ? this.playlistsService.getTracksToAdd(request, request.query.from.toString())
      : this.playlistsService.addTracksByRequest(request);
  }

  @Delete(':id')
  removeTracks(@Req() request: Request): Observable<never> {
    this.logger.log(`Removing tracks from: ${request.params.id}`);
    return request.query.from
      ? this.playlistsService.getTracksToRemove(request, request.query.from.toString())
      : this.playlistsService.removeTracksByRequest(request);
  }

}
