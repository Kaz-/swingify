import { Controller, Get, Logger, HttpService, Req, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';

import { SpotifyConfiguration, SpotifyUser, SpotifyPlaylists } from 'src/models/spotify.models';

@Controller('spotify')
export class SpotifyManagerController {

    private logger = new Logger('Spotify Manager Controller');
    private baseApiUrl: string = 'https://api.spotify.com/v1';

    constructor(
        private http: HttpService,
        private spotifyService: SpotifyManagerService
    ) { }

    @Get('configuration')
    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        this.logger.log('Requesting Spotify configuration');
        return this.spotifyService.getSpotifyConfiguration();
    }

    @Get('me')
    getUserProfile(@Req() request: Request): Observable<SpotifyUser> {
        const authorization = { Authorization: request.headers['authorization'] ? request.headers['authorization'] : null  };
        return this.http.get<SpotifyUser>(`${this.baseApiUrl}/me`, { headers: authorization })
            .pipe(map(response => response.data));
    }

    @Get('playlists')
    getPlaylists(@Req() request: Request): Observable<SpotifyPlaylists> {
        const authorization = { Authorization: request.headers['authorization'] ? request.headers['authorization'] : null };
        return this.getUserProfile(request)
            .pipe(flatMap(user =>
                this.http.get<SpotifyPlaylists>(`${this.baseApiUrl}/users/${user.id}/playlists`, { headers: authorization })
                    .pipe(map(response => response.data))
            ));
    }

}
