import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Details, Snippet, YoutubePaging, PlaylistOverview } from '../../models/youtube.models';
import { YoutubeService } from '../../services/youtube.service';

@Component({
  selector: 'swg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router,
    private youtubeService: YoutubeService
  ) { }

  get user$(): Observable<Details<Snippet>> {
    return this.youtubeService.user$;
  }

  get playlists$(): Observable<YoutubePaging<PlaylistOverview>> {
    return this.youtubeService.playlists$;
  }

  redirect(playlistId: string): void {
    this.router.navigate(['/youtube/export'], { queryParams: { p: playlistId } });
  }

}
