import { HttpService, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { map, expand, takeWhile } from 'rxjs/operators';

import { environment } from '../config/environment';
import { YoutubePaging, PlaylistItem } from '../models/youtube.models';
import { SharedService } from './shared.service';

@Injectable()
export class PlaylistsService {

  constructor(private http: HttpService) { }

  getTracksByRequest(request: Request): Observable<YoutubePaging<PlaylistItem>> {
    return this.http.get<YoutubePaging<PlaylistItem>>(
      request.query.next
        ? Buffer.from(request.query.next.toString(), 'base64').toString()
        : `${environment.apiBaseUrl}/playlistItems`,
      {
        params: { part: 'snippet', playlistId: request.params.id },
        headers: SharedService.getAuthorizationHeader(request)
      }).pipe(map(response => response.data));
  }

  getTracksByNext(next: string, authorization: string): Observable<YoutubePaging<PlaylistItem>> {
    return this.http.get<YoutubePaging<PlaylistItem>>(next, { headers: authorization })
      .pipe(map(response => response.data));
  }

  getCompleteTracklist(request: Request): Observable<YoutubePaging<PlaylistItem>> {
    return this.getTracksByRequest(request).pipe(
      expand(tracks => this.getTracksByNext(tracks.nextPageToken, SharedService.getAuthorizationHeader(request))),
      takeWhile(tracks => Boolean(tracks.nextPageToken), true)
    );
  }

}
