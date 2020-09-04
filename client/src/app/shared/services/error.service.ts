import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { SUPPORTED_ERRORS } from '../models/shared.models';

@Injectable()
export class ErrorService {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) { }

  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 500) {
      this.toastr.error('Please refresh the page and try again.', 'Internal Server Error', { progressBar: true });
    } else {
      SUPPORTED_ERRORS.includes(error.status)
        ? this.router.navigateByUrl(`error/${error.status}`)
        : this.router.navigateByUrl('error/404');
    }
    return EMPTY;
  }

}
