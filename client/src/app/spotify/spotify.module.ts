import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ExportComponent } from './components/export/export.component';
import { SpotifyService } from './services/spotify.service';

@NgModule({
  declarations: [ExportComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [SpotifyService],
  exports: [ExportComponent]
})
export class SpotifyModule { }
