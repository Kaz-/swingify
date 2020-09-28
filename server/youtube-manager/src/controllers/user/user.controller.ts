import { Controller, Get, HttpService, Logger, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { AuthorizationToken, AuthorizeQueryOptions, SCOPES } from '../../models/youtube.models';
import { SharedService } from '../../services/shared.service';

@Controller('user')
export class UserController {

  private logger = new Logger('User Controller');

  constructor(
    private http: HttpService,
    private sharedService: SharedService
  ) { }

  @Get('verify')
  verify(@Req() request: Request): Observable<AuthorizationToken> {
    this.logger.log('Verifying authentication');
    return this.sharedService.getYoutubeConfiguration().pipe(
      mergeMap(config => {
        const options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          params: {
            client_id: config.client_id,
            client_secret: config.client_secret,
            code: request.query.authorizationCode,
            grant_type: 'authorization_code',
            redirect_uri: `${this.sharedService.baseUrl}/process?platform=youtube`,
          }
        };
        return this.http.post<AuthorizationToken>(config.token_uri, null, options);
      }),
      map(response => response.data)
    );
  }

  @Get('authorize')
  authenticate(): Observable<string> {
    this.logger.log('Authorizing authentication');
    return this.sharedService.getYoutubeConfiguration().pipe(
      map(config => {
        const options: AuthorizeQueryOptions = {
          clientId: config.client_id,
          redirectUri: escape(config.redirect_uris[0]),
          responseType: 'code',
          scope: SCOPES,
          accessType: 'offline',
          prompt: 'consent'
        };
        return `${config.auth_uri}?client_id=${options.clientId}` +
          `&redirect_uri=${options.redirectUri}&response_type=${options.responseType}` +
          `&scope=${options.scope}&access_type=${options.accessType}&prompt=${options.prompt}`;
      })
    );
  }

}
