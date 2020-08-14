import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyPlaylist } from 'src/app/spotify/models/spotify.models';

@Component({
  selector: 'exp-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent {

  @Input() playlist$: Observable<SpotifyPlaylist>;

  toDuration(durationInMs: number): string {
    const minutes: number = Math.floor(durationInMs / 60000);
    const seconds: string = ((durationInMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds, 10) < 10 ? '0' : ''}${seconds}`;
  }

}
