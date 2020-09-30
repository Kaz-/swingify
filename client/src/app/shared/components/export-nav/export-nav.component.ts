import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { SpotifyPaging } from '../../../spotify/models/spotify.models';
import { Snippet, YoutubePaging } from '../../../youtube/models/youtube.models';

@Component({
  selector: 'swg-export-nav',
  templateUrl: './export-nav.component.html',
  styleUrls: ['./export-nav.component.scss']
})
export class ExportNavComponent<U, T, S, P, R extends Snippet> {

  @Input() user$: Observable<U>;
  @Input() playlists$: Observable<SpotifyPaging<P> | YoutubePaging<R>>;
  @Input() playlist$: Observable<P>;
  @Input() playlistTracks$: Observable<SpotifyPaging<T> | YoutubePaging<R>>;
  @Input() savedTracks$?: Observable<SpotifyPaging<S> | YoutubePaging<R>>;
  @Input() isSecondary: boolean;
  @Input() isAuthenticated: boolean;

  @Output() navigateBack: EventEmitter<void> = new EventEmitter<void>();
  @Output() authenticate: EventEmitter<void> = new EventEmitter<void>();

  onNavigateBack(): void {
    this.navigateBack.emit();
  }

  onAuthenticate(): void {
    this.authenticate.emit();
  }

}
