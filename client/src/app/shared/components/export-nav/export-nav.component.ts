import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { PlaylistTrack, SavedTrack, SpotifyPaging, SpotifyPlaylist, SpotifyUser } from '../../../spotify/models/spotify.models';
import { Details, PlaylistItem, PlaylistOverview, Snippet, YoutubePaging } from '../../../youtube/models/youtube.models';

@Component({
  selector: 'swg-export-nav',
  templateUrl: './export-nav.component.html',
  styleUrls: ['./export-nav.component.scss']
})
export class ExportNavComponent {

  @Input() user$: Observable<SpotifyUser | Details<Snippet>>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist> | YoutubePaging<PlaylistOverview>>;
  @Input() playlist$: Observable<SpotifyPlaylist | Details<PlaylistOverview>>;
  @Input() playlistTracks$: Observable<SpotifyPaging<PlaylistTrack> | YoutubePaging<PlaylistItem>>;
  @Input() savedTracks$?: Observable<SpotifyPaging<SavedTrack>>;
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
