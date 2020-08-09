import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthorizationToken } from '../models/spotify.models';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.processInterception(AuthService.getToken(), request, next);
  }

  private processInterception(token: AuthorizationToken | null, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (token && !AuthService.isTokenExpired(token)) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
    } else {
      request = request.clone();
    }
    return next.handle(request);
  }

}
