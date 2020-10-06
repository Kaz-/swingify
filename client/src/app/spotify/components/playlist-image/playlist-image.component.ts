import { Component, Input } from '@angular/core';
import { SavedTrack, SpotifyPaging, SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'swg-spotify-playlist-image',
  templateUrl: './playlist-image.component.html',
  styleUrls: ['./playlist-image.component.scss']
})
export class PlaylistImageComponent {

  @Input() playlist: SpotifyPlaylist;
  @Input() savedTracks: SpotifyPaging<SavedTrack>;

}
