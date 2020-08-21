import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { ProcessComponent } from './components/process/process.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { CardComponent } from './components/card/card.component';
import { PlaylistImageComponent } from './components/playlist-image/playlist-image.component';

@NgModule({
  declarations: [
    LoginComponent,
    ProcessComponent,
    HomeComponent,
    PlaylistComponent,
    CardComponent,
    PlaylistImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InfiniteScrollModule
  ],
  providers: [AuthService, AuthGuard],
  exports: [PlaylistComponent, CardComponent, PlaylistImageComponent]
})
export class SharedModule { }
