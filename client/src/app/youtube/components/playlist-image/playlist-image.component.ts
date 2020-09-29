import { Component, Input } from '@angular/core';
import { PlaylistOverview } from '../../models/youtube.models';

@Component({
  selector: 'swg-playlist-image',
  templateUrl: './playlist-image.component.html',
  styleUrls: ['./playlist-image.component.scss']
})
export class PlaylistImageComponent {

  @Input() playlist: PlaylistOverview;

}
