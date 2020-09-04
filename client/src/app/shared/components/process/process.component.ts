import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { AuthorizationToken } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'swg-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.route.queryParams
      .pipe(flatMap(params => this.isSecondaryAuthentication(params)))
      .subscribe(token => {
        token.created_at = Math.round(Date.now() / 1000); // in seconds
        this.setTokenAccordingly(token);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private isSecondaryAuthentication(params: Params): Observable<AuthorizationToken> {
    return AuthService.isAuthenticated()
      ? this.authService.verify(params.code, true)
      : this.authService.verify(params.code, false);
  }

  private setTokenAccordingly(token: AuthorizationToken): void {
    AuthService.isAuthenticated() ? AuthService.setSecondaryToken(token) : AuthService.setToken(token);
    this.router.navigateByUrl('/spotify/home');
  }

}
