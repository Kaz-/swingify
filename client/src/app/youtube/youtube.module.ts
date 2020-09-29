import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './components/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';

import { AuthGuard } from '../youtube/guards/auth.guard';


@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    ProfileMenuComponent,
    PlaylistsComponent
  ],
  imports: [
    CommonModule,
    YoutubeRoutingModule,
    SharedModule
  ],
  providers: [
    AuthGuard
  ]
})
export class YoutubeModule { }
