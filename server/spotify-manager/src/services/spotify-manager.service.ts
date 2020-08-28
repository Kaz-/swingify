import { Injectable, HttpService, flatten } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable, from, EMPTY, Subject, of } from 'rxjs';
import { map, flatMap, tap, bufferWhen, expand, takeWhile } from 'rxjs/operators';

import { environment } from 'environment';
import { SpotifyConfiguration, PlaylistTrack, SpotifyPaging } from 'src/models/spotify.models';

@Injectable()
export class SpotifyManagerService {

    private client: ClientProxy;
    private baseApiUrl: string = environment.apiBaseUrl;

    constructor(private http: HttpService) {
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

    getAuthorizationHeader(request: Request): any {
        return {
            Authorization: request.headers['authorization'] ? request.headers['authorization'] : null,
            'Content-Type': 'application/json'
        };
    }

    getTracksByRequest(request: Request, from?: string): Observable<SpotifyPaging<PlaylistTrack>> {
        return this.http.get<SpotifyPaging<PlaylistTrack>>(
            request.query.next
                ? Buffer.from(request.query.next.toString(), 'base64').toString()
                : `${this.baseApiUrl}/playlists/${from ? from : request.params.id}/tracks?offset=0&limit=100`,
            { headers: this.getAuthorizationHeader(request) }).pipe(map(response => response.data));
    }

    getTracksByNext(next: string, authorization: string): Observable<SpotifyPaging<PlaylistTrack>> {
        return this.http.get<SpotifyPaging<PlaylistTrack>>(next, { headers: authorization })
            .pipe(map(response => response.data));
    }

    getTracksToAdd(request: Request, playlist: string): Observable<never> {
        return this.getCompleteTracklist(request, playlist).pipe(
            map(tracks => tracks.items.map(item => item.track.uri)),
            map(uris => ({ uris: [...uris] })),
            flatMap(tracklist => this.addTracksByRequest(request, true, tracklist))
        )
    }

    addTracksByRequest(request: Request, complete?: boolean, tracklist?: { uris: string[] }): Observable<never> {
        return this.http.post<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`,
            complete ? JSON.stringify(tracklist) : JSON.stringify(request.body),
            { headers: this.getAuthorizationHeader(request) }
        ).pipe(flatMap(() => EMPTY));
    }

    getTracksToRemove(request: Request, playlist: string): Observable<never> {
        const closingEvent: Subject<boolean> = new Subject<boolean>();
        return this.getCompleteTracklist(request, playlist).pipe(
            tap(tracks => this.toggleClosingBuffer(tracks, closingEvent)),
            map(tracks => tracks.items.map(item => item.track.uri)),
            bufferWhen(() => closingEvent.asObservable()),
            map(buffer => flatten(buffer)),
            map(uris => this.formatTracksToRemoveAsChunks(uris)),
            flatMap(tracklist => tracklist.pipe(
                flatMap(list => this.removeTracksByRequest(request, true, list))
            ))
        )
    }

    removeTracksByRequest(
        request: Request,
        complete?: boolean,
        tracklist?: { tracks: { uri: string }[] }
    ): Observable<never> {
        return this.http.delete<never>(
            `${this.baseApiUrl}/playlists/${request.params.id}/tracks`,
            {
                data: complete
                    ? JSON.stringify(tracklist)
                    : JSON.stringify(this.formatTracksToRemove(request.body)),
                headers: this.getAuthorizationHeader(request)
            }
        ).pipe(flatMap(() => EMPTY));
    }

    getCompleteTracklist(request: Request, from?: string): Observable<SpotifyPaging<PlaylistTrack>> {
        return this.getTracksByRequest(request, from).pipe(
            expand(tracks => this.getTracksByNext(tracks.next, this.getAuthorizationHeader(request))),
            takeWhile(tracks => Boolean(tracks.next), true)
        );
    }

    private toggleClosingBuffer(tracks: SpotifyPaging<PlaylistTrack>, closingEvent: Subject<boolean>): void {
        if (!tracks.next && !tracks.previous) {
            closingEvent.next(true);
        }
    }

    formatTracksToRemoveAsChunks(tracks: string[]): Observable<{ tracks: { uri: string }[] }> {
        const max = 100;
        return from(Array(Math.ceil(tracks.length / max))
            .fill(null)
            .map(() => tracks.splice(0, max), tracks.slice())
            .map(tracks => ({ tracks: tracks.map(track => ({ uri: track })) })));
    }

    formatTracksToRemove(tracks: string[]): { tracks: { uri: string }[] } {
        return { tracks: tracks.map(track => ({ uri: track })) };
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
