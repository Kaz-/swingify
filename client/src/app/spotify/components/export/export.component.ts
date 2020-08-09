import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(flatMap(params => this.spotifyService.getPlaylist(params[0])));
  }

}
