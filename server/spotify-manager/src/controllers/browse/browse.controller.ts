import { Controller, Get, HttpService, Logger, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { SpotifyFeaturedPlaylists } from '../../models/spotify.models';
import { SharedService } from '../../services/shared.service';

@Controller('browse')
export class BrowseController {

  private logger = new Logger('Browse Controller');

  constructor(private http: HttpService) { }

  @Get('featured')
  getFeaturedPlaylists(@Req() request: Request): Observable<SpotifyFeaturedPlaylists> {
    this.logger.log(`Requesting featured playlists with default locale`);
    return this.http.get<SpotifyFeaturedPlaylists>(
      `${environment.apiBaseUrl}/browse/featured-playlists`,
      { headers: SharedService.getAuthorizationHeader(request) }
    ).pipe(map(response => response.data));
  }

}
