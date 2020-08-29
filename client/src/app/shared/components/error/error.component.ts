import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SUPPORTED_ERRORS } from '../../models/shared.models';

@Component({
  selector: 'exp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  status$: Observable<number>;
  isServerActive: boolean;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.status$ = this.route.params.pipe(
      map(params => parseInt(params.status, 10)),
      tap(status => this.isServerActive = !(status === 500 || status === 504) )
    );
  }

}
