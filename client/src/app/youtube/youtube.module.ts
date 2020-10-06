import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';

import { AuthGuard } from '../youtube/guards/auth.guard';
import { PlaylistImageComponent } from './components/playlist-image/playlist-image.component';
import { ExportComponent } from './components/export/export.component';
import { PlaylistNavComponent } from './components/playlist-nav/playlist-nav.component';
import { SpotifyModule } from '../spotify/spotify.module';


@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    ProfileMenuComponent,
    PlaylistsComponent,
    PlaylistImageComponent,
    ExportComponent,
    PlaylistNavComponent
  ],
  imports: [
    CommonModule,
    YoutubeRoutingModule,
    SharedModule,
    SpotifyModule
  ],
  providers: [
    AuthGuard
  ]
})
export class YoutubeModule { }
