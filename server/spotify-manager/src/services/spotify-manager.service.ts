import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { SpotifyConfiguration } from 'src/models/spotify.models';

@Injectable()
export class SpotifyManagerService {

    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
                host: 'localhost',
                port: 1337
            }
        })
    }

    getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
        // Sending empty string because there is no need to send any data
        return this.client.send('spotifyConfiguration', '');
    }

    formatTracksToRemove(tracks: string[]): { tracks: { uri: string }[] } {
        return { tracks: tracks.map(track => ({ uri: track })) }
    }

}
