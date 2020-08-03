import { Controller, Get, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';

import { SpotifyConfiguration } from 'src/models/spotify.models';

@Controller('spotify')
export class SpotifyManagerController {

    private logger = new Logger('Spotify Manager Controller');

    constructor(private spotifyService: SpotifyManagerService) { }

    @Get('configuration')
    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        this.logger.log('Requesting Spotify configuration');
        return this.spotifyService.getSpotifyConfiguration();
    }
}
