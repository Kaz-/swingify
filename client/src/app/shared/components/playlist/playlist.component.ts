import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { SpotifyPlaylist, SpotifyPaging, PlaylistTrack } from 'src/app/spotify/models/spotify.models';
import { PlaylistAction, ETrackAction } from '../../models/shared.models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'exp-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  @Input() playlists$: Observable<SpotifyPaging<SpotifyPlaylist>>;
  @Input() playlist$: Observable<SpotifyPlaylist>;
  @Input() tracks$: Observable<SpotifyPaging<PlaylistTrack>>;
  @Input() isSecondary?: boolean;
  @Output() action: EventEmitter<PlaylistAction> = new EventEmitter<PlaylistAction>();
  @Output() next: EventEmitter<string> = new EventEmitter<string>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  searchControl: FormControl = new FormControl('');
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

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

  navigate(playlistId: string): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { secondary: playlistId } });
  }

  execute(tracks: PlaylistTrack[] | string): void {
    const action: any = {
      trackUris: Array.isArray(tracks) ? tracks.map(t => t.track.uri) : [tracks],
      action: this.isSecondary ? ETrackAction.REMOVE : ETrackAction.ADD
    };
    this.action.emit(action);
  }

  onScroll(tracks: SpotifyPaging<PlaylistTrack>): void {
    if (tracks.next) {
      this.next.emit(tracks.next);
    }
  }

}
