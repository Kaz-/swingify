import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'exp-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  status$: Observable<number>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.status$ = this.route.params.pipe(
      map(params => parseInt(params.status, 10))
    );
  }

}
