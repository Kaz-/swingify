import { Component, Input } from '@angular/core';
import { SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'exp-playlist-image',
  templateUrl: './playlist-image.component.html',
  styleUrls: ['./playlist-image.component.scss']
})
export class PlaylistImageComponent {

  @Input() playlist: SpotifyPlaylist;

}
