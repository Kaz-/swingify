import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationToken } from '../models/spotify.models';
import { SpotifyService } from './spotify.service';
import { Router } from '@angular/router';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.processInterception(SpotifyService.getToken(), request, next);
  }

  private processInterception(token: AuthorizationToken | null, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (token && !SpotifyService.isTokenExpired(token)) {
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
