import { Controller, Get, HttpService, Logger, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { PlaylistOverview, YoutubePaging } from '../../models/youtube.models';
import { SharedService } from '../../services/shared.service';

@Controller('playlists')
export class PlaylistsController {

  private logger = new Logger('Playlists Controller');

  constructor(private http: HttpService) { }

  @Get()
  getPlaylists(@Req() request: Request): Observable<YoutubePaging<PlaylistOverview>> {
    this.logger.log(`Requesting playlists`);
    return this.http.get<YoutubePaging<PlaylistOverview>>(
      `${environment.apiBaseUrl}/playlists`,
      {
        params: { mine: true, part: 'snippet' },
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(map(response => response.data));
  }

}
