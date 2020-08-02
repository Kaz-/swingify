import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent {

  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService
  ) { }

  verify(clientId: string, clientSecret: string): void {
    const CODE = 'code';
    this.route.queryParams.subscribe(params => this.spotifyService
      .verify(params[CODE], clientId, clientSecret).subscribe());
  }

}
