import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ExportComponent } from './components/export/export.component';
import { ProcessComponent } from './components/process/process.component';

import { SpotifyService } from './services/spotify.service';
import { SpotifyInterceptor } from './services/spotify.interceptor';

@NgModule({
  declarations: [ExportComponent, ProcessComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SpotifyService,
    { provide: HTTP_INTERCEPTORS, useClass: SpotifyInterceptor, multi: true }
  ],
  exports: [ExportComponent]
})
export class SpotifyModule { }
