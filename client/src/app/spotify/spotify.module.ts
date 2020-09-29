import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpotifyRoutingModule } from './spotify-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { ExportComponent } from './components/export/export.component';
import { PlaylistImageComponent } from './components/playlist-image/playlist-image.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { LikedComponent } from './components/liked/liked.component';
import { PlaylistNavComponent } from './components/playlist-nav/playlist-nav.component';

import { AuthGuard } from './guards/auth.guard';


@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    ExportComponent,
    PlaylistImageComponent,
    PlaylistComponent,
    ProfileMenuComponent,
    PlaylistsComponent,
    LikedComponent,
    PlaylistNavComponent
  ],
  imports: [
    CommonModule,
    SpotifyRoutingModule,
    SharedModule
  ],
  providers: [
    AuthGuard
  ]
})
export class SpotifyModule { }
