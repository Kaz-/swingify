import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { SpotifyService } from '../../../spotify/services/spotify.service';

@Component({
  selector: 'exp-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    const CODE = 'code';
    this.subscription = this.route.queryParams
      .pipe(flatMap(params => this.spotifyService.verify(params[CODE])))
      .subscribe(token => {
        token.created_at = Math.round(Date.now() / 1000); // in seconds
        SpotifyService.setToken(token);
        this.router.navigateByUrl('/spotify/home');
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
