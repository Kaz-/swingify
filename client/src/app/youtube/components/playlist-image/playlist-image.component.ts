import { Component, Input } from '@angular/core';
import { Details, PlaylistOverview } from '../../models/youtube.models';

@Component({
  selector: 'swg-youtube-playlist-image',
  templateUrl: './playlist-image.component.html',
  styleUrls: ['./playlist-image.component.scss']
})
export class PlaylistImageComponent {

  @Input() playlist: Details<PlaylistOverview>;

}
