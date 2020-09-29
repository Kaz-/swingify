import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { SpotifyAuthService } from '../../shared/services/spotify-auth.service';
import { YoutubeAuthService } from '../../shared/services/youtube-auth.service';
import { AuthorizationToken } from '../../shared/models/shared.models';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return request.url.startsWith(environment.spotify.basePath)
      ? this.processInterceptionAsSpotify(request, next)
      : this.processInterceptionAsYoutube(request, next);
  }

  private processInterceptionAsSpotify(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.headers.get('Secondary') === 'true'
      ? this.mutateForSecondaryAsSpotify(request)
      : this.mutateForPrimaryAsSpotify(request);
    return next.handle(request);
  }

  private mutateForPrimaryAsSpotify(request: HttpRequest<any>): HttpRequest<any> {
    const token: AuthorizationToken = SpotifyAuthService.getToken();
    if (SpotifyAuthService.isAuthenticated()) {
      request = request.clone({
        headers: request.headers.delete('Secondary'),
        setHeaders: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
    } else {
      request = request.clone({
        headers: request.headers.delete('Secondary'),
      });
    }
    return request;
  }

  private mutateForSecondaryAsSpotify(request: HttpRequest<any>): HttpRequest<any> {
    if (SpotifyAuthService.isSecondaryAuthenticated()) {
      const token: AuthorizationToken = SpotifyAuthService.getSecondaryToken();
      request = request.clone({
        headers: request.headers.delete('Secondary'),
        setHeaders: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
    } else {
      request = request.clone({
        headers: request.headers.delete('Secondary'),
      });
    }
    return request;
  }

  private processInterceptionAsYoutube(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: AuthorizationToken = YoutubeAuthService.getToken();
    if (YoutubeAuthService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
    }
    return next.handle(request);
  }

}
