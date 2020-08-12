import { Controller, Get, Logger, HttpService, Req } from '@nestjs/common';
import { Request } from 'express';
import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';
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

    private getAuthorizationHeader(request: Request): AxiosRequestConfig {
        const authorization = { Authorization: request.headers['authorization'] ? request.headers['authorization'] : null };
        return { headers: authorization };
    }

    @Get('configuration')
    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        this.logger.log('Requesting Spotify configuration');
        return this.spotifyService.getSpotifyConfiguration();
    }

    @Get('me')
    getUserProfile(@Req() request: Request): Observable<SpotifyUser> {
        return this.http.get<SpotifyUser>(`${this.baseApiUrl}/me`, this.getAuthorizationHeader(request))
            .pipe(map(response => response.data));
    }

    @Get('playlists')
    getPlaylists(@Req() request: Request): Observable<SpotifyPaging<SpotifyPlaylist>> {
        return this.getUserProfile(request)
            .pipe(flatMap(user =>
                this.http.get<SpotifyPaging<SpotifyPlaylist>>(`${this.baseApiUrl}/users/${user.id}/playlists`, this.getAuthorizationHeader(request))
                    .pipe(map(response => response.data))
            ));
    }

    @Get('playlist/:id')
    getPlaylist(@Req() request: Request): Observable<SpotifyPlaylist> {
        return this.http.get<SpotifyPlaylist>(`${this.baseApiUrl}/playlists/${request.params.id}`, this.getAuthorizationHeader(request))
            .pipe(map(response => response.data));
    }

}
