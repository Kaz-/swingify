import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';
import { SpotifyPlaylist, SpotifyUser } from '../../models/spotify.models';

@Component({
  selector: 'exp-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  spotifyUser$: Observable<SpotifyUser>;
  spotifyPlaylists$: Observable<SpotifyPlaylist[]>;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyUser$ = this.spotifyService.getUser();
    this.spotifyPlaylists$ = this.spotifyService.getPlaylists();
  }

}
