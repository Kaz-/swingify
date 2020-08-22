import { Controller, Get, Logger, HttpService, Req, Post, Delete } from '@nestjs/common';
import { Request } from 'express';
import { Observable, EMPTY, of } from 'rxjs';
import { map, flatMap, expand, takeWhile, scan } from 'rxjs/operators';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';

import { SpotifyConfiguration, SpotifyUser, SpotifyPlaylist, SpotifyPaging, PlaylistTrack } from 'src/models/spotify.models';

@Controller('spotify')
export class SpotifyManagerController {

    private logger = new Logger('Spotify Manager Controller');
    private baseApiUrl: string = 'https://api.spotify.com/v1';

    constructor(
        private http: HttpService,
        private spotifyService: SpotifyManagerService
    ) { }

    private getAuthorizationHeader(request: Request): any {
        return {
            Authorization: request.headers['authorization'] ? request.headers['authorization'] : null,
            'Content-Type': 'application/json'
        };
    }

    @Get('configuration')
    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        this.logger.log('Requesting Spotify configuration');
        return this.spotifyService.getSpotifyConfiguration();
    }

    @Get('me')
    getUserProfile(@Req() request: Request): Observable<SpotifyUser> {
        this.logger.log(`Requesting user's profile`);
        return this.http.get<SpotifyUser>(`${this.baseApiUrl}/me`, { headers: this.getAuthorizationHeader(request) })
            .pipe(map(response => response.data));
    }

    @Get('playlists')
    getPlaylists(@Req() request: Request): Observable<SpotifyPaging<SpotifyPlaylist>> {
        return this.getUserProfile(request)
            .pipe(flatMap(user => {
                this.logger.log(`Requesting playlists for user: ${user.id}`);
                return this.http.get<SpotifyPaging<SpotifyPlaylist>>(
                    `${this.baseApiUrl}/users/${user.id}/playlists`,
                    { headers: this.getAuthorizationHeader(request) }
                ).pipe(map(response => response.data));
            }));
    }

    @Get('playlists/:id')
    getPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
        this.logger.log(`Requesting playlist with ID: ${request.params.id}`);
        return this.http.get<SpotifyPlaylist>(
            `${this.baseApiUrl}/playlists/${request.params.id}`,
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
    }

    @Get('playlists/:id/tracks')
    getPlaylistTracks(@Req() request: Request): Observable<SpotifyPaging<PlaylistTrack>> {
        this.logger.log(`Requesting tracks from playlist: ${request.params.id}`);
        return this.getTracksByRequest(request).pipe(
            expand(tracks => this.getTracksByNext(tracks.next, this.getAuthorizationHeader(request))),
            takeWhile(tracks => request.query.search && tracks.next ? true : false, true),
            scan((prev, next) => ({ ...next, items: [...prev.items, ...next.items] })),
            map(tracks => request.query.search
                ? ({
                    ...tracks,
                    items: tracks.items.filter(item => this.findMatchInTrack(item, request.query.search.toString().toLowerCase().trim())),
                    next: null
                }) : tracks
            ));
    }

    private getTracksByRequest(request: Request): Observable<SpotifyPaging<PlaylistTrack>> {
        return this.http.get<SpotifyPaging<PlaylistTrack>>(
            request.query.next
                ? Buffer.from(request.query.next.toString(), 'base64').toString()
                : `${this.baseApiUrl}/playlists/${request.params.id}/tracks?offset=0&limit=100`,
            { headers: this.getAuthorizationHeader(request) }).pipe(map(response => response.data));
    }

    private getTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<PlaylistTrack>> {
        return this.http.get<SpotifyPaging<PlaylistTrack>>(next, { headers: authorization })
            .pipe(map(response => response.data));
    }

    private findMatchInTrack(item: PlaylistTrack, query: string): boolean {
        return item.track.name.toLowerCase().trim().includes(query)
            || item.track.album.name.toLowerCase().trim().includes(query)
            || this.findMatchInArtists(item, query);
    }

    private findMatchInArtists(item: PlaylistTrack, query: string): boolean {
        return item.track.artists.some(artist => artist.name.toLowerCase().trim().includes(query));
    }

    @Post('users/:id/playlists')
    createPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
        this.logger.log(`Creating a new playlist for user: ${request.params.id}`);
        return this.http.post<SpotifyPlaylist>(
            `${this.baseApiUrl}/users/${request.params.id}/playlists`, JSON.stringify(request.body),
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
    }

    @Post('/playlists/:id')
    addTracks(@Req() request: Request): Observable<never> {
        this.logger.log(`Adding new tracks in: ${request.params.id}`);
        return this.http.post<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`, JSON.stringify(request.body),
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(flatMap(() => EMPTY));
    }

    @Delete('/playlists/:id')
    removeTracks(@Req() request: Request): Observable<never> {
        this.logger.log(`Removing tracks in: ${request.params.id}`);
        return this.http.delete<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`,
            { data: JSON.stringify(this.spotifyService.formatTracksToRemove(request.body)), headers: this.getAuthorizationHeader(request) }
        ).pipe(flatMap(() => EMPTY));
    }

}
