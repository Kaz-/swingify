import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

import { SpotifyManagerService } from 'src/services/spotify-manager.service';
import { AuthService } from 'src/services/auth.service';

@Controller('spotify')
export class SpotifyManagerController {

    private logger = new Logger('Spotify Manager Controller');

    constructor(
        private spotifyService: SpotifyManagerService,
        private authService: AuthService
    ) { }

    @Get('authorize')
    authorize(): Observable<AxiosResponse<any>> {
        return this.authService.authorize();
    }

    @Post('ping')
    ping(@Body('data') data: string): Observable<string> {
        this.logger.log('Sending ping and data to Core Microservice !');
        return this.spotifyService.pingCoreMicroservice(data);
    }
}
