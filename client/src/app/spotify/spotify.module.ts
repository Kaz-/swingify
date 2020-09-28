import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { SpotifyRoutingModule } from './spotify-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './components/main/main.component';
import { ExportComponent } from './components/export/export.component';

import { AuthService } from './services/auth.service';
import { SpotifyInterceptor } from './services/spotify.interceptor';

@NgModule({
  declarations: [
    MainComponent,
    ExportComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    SpotifyRoutingModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ]
})
export class SpotifyModule { }
