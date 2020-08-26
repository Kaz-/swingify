import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Observable, from } from 'rxjs';

import { SpotifyConfiguration, PlaylistTrack } from 'src/models/spotify.models';

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

    formatTracksToRemove(tracks: string[]): Observable<{ tracks: { uri: string }[] }> {
        const max = 100;
        return from(Array(Math.ceil(tracks.length / max))
            .fill(null)
            .map(() => tracks.splice(0, max), tracks.slice())
            .map(tracks => ({ tracks: tracks.map(track => ({ uri: track })) })));
    }

    findMatchInTrack(item: PlaylistTrack, query: string): boolean {
        return item.track.name.toLowerCase().trim().includes(query)
            || item.track.album.name.toLowerCase().trim().includes(query)
            || this.findMatchInArtists(item, query);
    }

    private findMatchInArtists(item: PlaylistTrack, query: string): boolean {
        return item.track.artists.some(artist => artist.name.toLowerCase().trim().includes(query));
    }

}
