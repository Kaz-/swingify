import { Injectable } from '@nestjs/common';

import { environment } from 'environment';
import { SpotifyEnvironment } from '../models/spotify.models';

@Injectable()
export class AuthService {

    getSpotifyEnvironment(): SpotifyEnvironment {
        return environment.spotify;
    }

}