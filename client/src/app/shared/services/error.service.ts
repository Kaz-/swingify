import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { SUPPORTED_ERRORS } from '../models/shared.models';

@Injectable()
export class ErrorService {

  constructor(private router: Router) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    SUPPORTED_ERRORS.includes(error.status)
      ? this.router.navigateByUrl(`error/${error.status}`)
      : this.router.navigateByUrl('error/404');
    return EMPTY;
  }

}
