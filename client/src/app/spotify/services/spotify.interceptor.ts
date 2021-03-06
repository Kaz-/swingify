import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthorizationToken } from '../models/spotify.models';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.processInterception(request, next);
  }

  private processInterception(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.headers.get('Secondary') === 'true'
      ? this.transformRequestForSecondary(request)
      : this.transformRequestForPrimary(request);
    return next.handle(request);
  }

  private transformRequestForPrimary(request: HttpRequest<any>): HttpRequest<any> {
    const token: AuthorizationToken = AuthService.getToken();
    if (AuthService.isAuthenticated()) {
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

  private transformRequestForSecondary(request: HttpRequest<any>): HttpRequest<any> {
    if (AuthService.isSecondaryAuthenticated()) {
      const token: AuthorizationToken = AuthService.getSecondaryToken();
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

}
