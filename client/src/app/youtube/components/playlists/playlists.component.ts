import { Component, Input } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Details, PlaylistOverview, Snippet, YoutubePaging } from '../../models/youtube.models';

@Component({
  selector: 'swg-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent {

  @Input() title: string;
  @Input() user$: Observable<Details<Snippet>>;
  @Input() playlists$: Observable<YoutubePaging<PlaylistOverview>>;

  constructor(private router: Router) { }

  navigate(toSavedTracks: boolean, playlistId?: string): void {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    if (toSavedTracks) {
      this.router.navigate(['/youtube/export'], { queryParams: { p: 'liked', s: tree.queryParams.s } });
    } else {
      tree.queryParams
        ? this.router.navigate(['/youtube/export'], { queryParams: { p: playlistId, s: tree.queryParams.s } })
        : this.router.navigate(['/youtube/export'], { queryParams: { p: playlistId } });
    }
  }

}
