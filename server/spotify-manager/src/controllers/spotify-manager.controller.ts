import { Controller, Get, Logger, HttpService, Req, Post, Delete } from '@nestjs/common';
import { Request } from 'express';
import { Observable, EMPTY } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';

import { SpotifyConfiguration, SpotifyUser, SpotifyPlaylist, SpotifyPaging } from 'src/models/spotify.models';

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
        return this.http.get<SpotifyUser>(`${this.baseApiUrl}/me`, { headers: this.getAuthorizationHeader(request) })
            .pipe(map(response => response.data));
    }

    @Get('playlists')
    getPlaylists(@Req() request: Request): Observable<SpotifyPaging<SpotifyPlaylist>> {
        return this.getUserProfile(request)
            .pipe(flatMap(user =>
                this.http.get<SpotifyPaging<SpotifyPlaylist>>(
                    `${this.baseApiUrl}/users/${user.id}/playlists`,
                    { headers: this.getAuthorizationHeader(request) }
                ).pipe(map(response => response.data))
            ));
    }

    @Get('playlist/:id')
    getPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
        return this.http.get<SpotifyPlaylist>(
            `${this.baseApiUrl}/playlists/${request.params.id}`,
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
    }

    @Post('users/:id/playlists')
    createPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
        return this.http.post<SpotifyPlaylist>(
            `${this.baseApiUrl}/users/${request.params.id}/playlists`, JSON.stringify(request.body),
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(map(response => response.data));
    }

    @Post('/playlist/:id')
    addTracks(@Req() request: Request): Observable<never> {
        return this.http.post<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`, JSON.stringify(request.body),
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(flatMap(() => EMPTY));
    }

    @Delete('/playlist/:id')
    removeTracks(@Req() request: Request): Observable<never> {
        return this.http.delete<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`,
            { data: JSON.stringify(this.spotifyService.formatTracksToRemove(request.body)), headers: this.getAuthorizationHeader(request) }
        ).pipe(flatMap(() => EMPTY));
    }

}
