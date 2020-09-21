import { Controller, Get, HttpService, Logger, Req } from '@nestjs/common';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { environment } from '../../config/environment';
import { AuthorizationToken, AuthorizeQueryOptions, SCOPES, SpotifyUser } from '../../models/spotify.models';
import { SharedService } from '../../services/shared/shared.service';

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
    return this.sharedService.getSpotifyConfiguration().pipe(
      mergeMap(config => {
        const options = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
          },
          params: {
            grant_type: 'authorization_code',
            code: request.query.authorizationCode,
            redirect_uri: `${this.sharedService.baseUrl}/process`
          }
        };
        return this.http.post<AuthorizationToken>(`${environment.accountsPath}/api/token`, null, options);
      }),
      map(response => response.data)
    );
  }

  @Get('authorize')
  authorize(): Observable<string> {
    this.logger.log('Authorizing authentication');
    return this.sharedService.getSpotifyConfiguration().pipe(
      map(config => {
        const options: AuthorizeQueryOptions = {
          responseType: 'code',
          clientId: config.clientId,
          redirectUri: escape(`${this.sharedService.baseUrl}/process`),
          scope: SCOPES,
          showDialog: true
        };
        return `${environment.accountsPath}/authorize?client_id=${options.clientId}` +
          `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}` +
          `&scope=${encodeURIComponent(options.scope)}&show_dialog=${options.showDialog}`;
      })
    );
  }

  @Get('me')
  getUserProfile(@Req() request: Request): Observable<SpotifyUser> {
    this.logger.log(`Requesting user's profile`);
    return this.sharedService.getUserProfile(request);
  }

}
