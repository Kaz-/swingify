import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { SpotifyModule } from './spotify/spotify.module';
import { YoutubeModule } from './youtube/youtube.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    SharedModule,
    SpotifyModule,
    YoutubeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
