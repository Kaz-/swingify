import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationToken } from '../models/spotify.models';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.processInterception(this.getToken(), request, next);
  }

  private processInterception(token: AuthorizationToken | null, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (token) {
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

  private getToken(): AuthorizationToken {
    return JSON.parse(localStorage.getItem('spotify_token'));
  }

}
