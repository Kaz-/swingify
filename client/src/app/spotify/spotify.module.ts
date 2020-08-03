import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ExportComponent } from './components/export/export.component';
import { SpotifyService } from './services/spotify.service';
import { ProcessComponent } from './components/process/process.component';

@NgModule({
  declarations: [ExportComponent, ProcessComponent],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [SpotifyService],
  exports: [ExportComponent]
})
export class SpotifyModule { }
