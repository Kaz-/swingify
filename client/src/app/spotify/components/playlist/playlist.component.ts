import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SpotifyPlaylist, SpotifyPaging, PlaylistTrack, SpotifyUser, Track } from 'src/app/spotify/models/spotify.models';
import { PlaylistAction, ETrackAction } from '../../../shared/models/shared.models';

@Component({
  selector: 'swg-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  @Input() user$: Observable<SpotifyUser>;
  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() playlist$: Observable<SpotifyPlaylist>;
  @Input() tracks$: Observable<SpotifyPaging<PlaylistTrack>>;
  @Input() isSecondary?: boolean;
  @Output() action: EventEmitter<PlaylistAction> = new EventEmitter<PlaylistAction>();
  @Output() next: EventEmitter<string> = new EventEmitter<string>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  searchControl: FormControl = new FormControl('');
  subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(next => this.search.emit(next));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toDuration(durationInMs: number): string {
    const minutes: number = Math.floor(durationInMs / 60000);
    const seconds: string = ((durationInMs % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds, 10) < 10 ? '0' : ''}${seconds}`;
  }

  execute(onAll: boolean, track?: Track): void {
    const action: PlaylistAction = {
      trackId: track?.id ? [track.id] : [],
      trackUri: track?.uri ? [track.uri] : [],
      action: this.isSecondary ? ETrackAction.REMOVE : ETrackAction.ADD,
      complete: onAll
    };
    this.action.emit(action);
  }

  onScroll(tracks: SpotifyPaging<PlaylistTrack>): void {
    if (tracks.next) {
      this.next.emit(tracks.next);
    }
  }

}
