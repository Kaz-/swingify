import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SUPPORTED_ERRORS } from '../../models/shared.models';

@Component({
  selector: 'exp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  status$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.status$ = this.route.params.pipe(
      map(params => params.status),
      map(status => SUPPORTED_ERRORS.includes(status) ? status : this.router.navigate(['error', '404']))
    );
  }

}
