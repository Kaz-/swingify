import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ErrorService } from './services/error.service';
import { LoaderService } from './services/loader.service';

import { LoginComponent } from './components/login/login.component';
import { ProcessComponent } from './components/process/process.component';
import { HomeComponent } from './components/home/home.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { CardComponent } from './components/card/card.component';
import { PlaylistImageComponent } from './components/playlist-image/playlist-image.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { LikedComponent } from './components/liked/liked.component';
import { PlaylistNavComponent } from './components/playlist-nav/playlist-nav.component';

import { FormatStatusPipe } from './pipes/status.pipe';
import { FormatErrorPipe } from './pipes/error.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';

@NgModule({
  declarations: [
    LoginComponent,
    ProcessComponent,
    HomeComponent,
    PlaylistComponent,
    CardComponent,
    PlaylistImageComponent,
    DropdownComponent,
    ProfileMenuComponent,
    PlaylistsComponent,
    DialogComponent,
    ErrorComponent,
    FormatErrorPipe,
    FormatStatusPipe,
    LikedComponent,
    PlaylistNavComponent,
    FooterComponent,
    PrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InfiniteScrollModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    ErrorService,
    LoaderService
  ],
  exports: [
    PlaylistComponent,
    CardComponent,
    PlaylistImageComponent,
    DropdownComponent,
    ProfileMenuComponent,
    PlaylistsComponent,
    DialogComponent,
    LikedComponent,
    PlaylistNavComponent,
    FooterComponent,
    PrivacyPolicyComponent
  ]
})
export class SharedModule { }
