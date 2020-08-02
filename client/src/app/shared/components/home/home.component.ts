import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { SpotifyService } from 'src/app/spotify/services/spotify.service';
import { AuthorizeQueryOptions } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'exp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private spotifyService: SpotifyService) { }

  redirect(): void {
    this.spotifyService.getSpotifyEnvironment().subscribe(env => {
      const options: AuthorizeQueryOptions = {
        responseType: 'code',
        clientId: env.clientId,
        redirectUri: 'http%3A%2F%2Flocalhost%3A4200%2Fspotify%2Fexport'
      };
      this.document.location.href = `${env.accountsPath}/authorize?client_id=${options.clientId}` +
        `&response_type=${options.responseType}&redirect_uri=${options.redirectUri}`;
    });
  }

}
