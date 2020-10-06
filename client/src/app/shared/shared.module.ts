import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ErrorService } from './services/error.service';
import { LoaderService } from './services/loader.service';
import { SpotifyAuthService } from './services/spotify-auth.service';
import { YoutubeAuthService } from './services/youtube-auth.service';

import { HomeComponent } from './components/home/home.component';
import { ProcessComponent } from './components/process/process.component';
import { CardComponent } from './components/card/card.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ErrorComponent } from './components/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { NavComponent } from './components/nav/nav.component';
import { ExportNavComponent } from './components/export-nav/export-nav.component';
import { ExportWrapperComponent } from './components/export-wrapper/export-wrapper.component';
import { PlaylistNavComponent } from './components/playlist-nav/playlist-nav.component';

import { FormatStatusPipe } from './pipes/status.pipe';
import { FormatErrorPipe } from './pipes/error.pipe';


@NgModule({
  declarations: [
    HomeComponent,
    ProcessComponent,
    CardComponent,
    DropdownComponent,
    DialogComponent,
    ErrorComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    FormatErrorPipe,
    FormatStatusPipe,
    NavComponent,
    ExportNavComponent,
    ExportWrapperComponent,
    PlaylistNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  providers: [
    ErrorService,
    LoaderService,
    SpotifyAuthService,
    YoutubeAuthService
  ],
  exports: [
    CardComponent,
    DropdownComponent,
    DialogComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    NavComponent,
    ExportNavComponent,
    ExportWrapperComponent,
    PlaylistNavComponent
  ]
})
export class SharedModule { }
