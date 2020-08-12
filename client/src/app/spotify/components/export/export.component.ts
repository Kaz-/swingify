import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, share } from 'rxjs/operators';

import { SpotifyService } from '../../services/spotify.service';
import { SpotifyPlaylist } from '../../models/spotify.models';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  playlist$: Observable<SpotifyPlaylist>;

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  ngOnInit(): void {
    this.playlist$ = this.route.params
      .pipe(
        flatMap(params => this.spotifyService.getPlaylist(params.id)),
        share()
      );
  }

  toDuration(durationInMs: number): string {
    const minutes: number = Math.floor(durationInMs / 60000);
    const seconds: string = ((durationInMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds, 10) < 10 ? '0' : ''}${seconds}`;
  }

}
