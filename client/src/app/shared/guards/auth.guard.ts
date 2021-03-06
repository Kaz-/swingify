import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(public router: Router) { }

  canActivate(): boolean {
    return this.checkAuthentication();
  }

  canActivateChild(): boolean {
    return this.checkAuthentication();
  }

  private checkAuthentication(): boolean {
    if (!AuthService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
