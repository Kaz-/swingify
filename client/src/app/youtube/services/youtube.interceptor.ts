import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { AuthorizationToken } from '../../shared/models/shared.models';

@Injectable()
export class YoutubeInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.processInterception(request, next);
  }

  private processInterception(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: AuthorizationToken = AuthService.getToken();
    if (AuthService.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token.token_type} ${token.access_token}`
        }
      });
    }
    return next.handle(request);
  }

}
