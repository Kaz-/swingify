import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'exp-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    const CODE = 'code';
    this.route.queryParams
      .pipe(flatMap(params => this.spotifyService.verify(params[CODE])))
      .subscribe(token => {
        localStorage.setItem('spotify_token', JSON.stringify(token));
        this.router.navigateByUrl('/spotify/export', { relativeTo: this.route });
      });
  }

}
