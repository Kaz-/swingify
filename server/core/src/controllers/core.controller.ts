import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { CoreService } from 'src/services/core.service';
import { SpotifyConfiguration } from 'src/schemas/spotify-configuration.schema';

@Controller('core')
export class CoreController {

    private logger = new Logger('Core Controller');

    constructor(private coreService: CoreService) { }

    @MessagePattern('spotifyConfiguration')
    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        this.logger.log(`Received request for Spotify configuration`);
        return this.coreService.getSpotifyConfiguration();
    }

}
