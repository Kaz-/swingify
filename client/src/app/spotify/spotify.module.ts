import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { MainComponent } from './components/main/main.component';
import { ExportComponent } from './components/export/export.component';

import { SpotifyService } from './services/spotify.service';
import { SpotifyInterceptor } from './services/spotify.interceptor';

@NgModule({
  declarations: [ExportComponent, MainComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    SpotifyService,
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ]
})
export class SpotifyModule { }
