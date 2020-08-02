import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';
import { AuthService } from 'src/services/auth.service';

import { SpotifyEnvironment } from 'src/models/spotify.models';

@Controller('spotify')
export class SpotifyManagerController {

    private logger = new Logger('Spotify Manager Controller');

    constructor(
        private spotifyService: SpotifyManagerService,
        private authService: AuthService
    ) { }

    @Get('environment')
    getSpotifyEnvironment(): SpotifyEnvironment {
        this.logger.log(`Received an authorize request, redirecting to Spotify's registration page`)
        return this.authService.getSpotifyEnvironment();
    }

    @Post('ping')
    ping(@Body('data') data: string): Observable<string> {
        this.logger.log('Sending ping and data to Core Microservice !');
        return this.spotifyService.pingCoreMicroservice(data);
    }
}
