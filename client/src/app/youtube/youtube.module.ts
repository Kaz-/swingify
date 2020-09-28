import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';

import { AuthService } from './services/auth.service';
import { AuthGuard } from '../youtube/guards/auth.guard';
import { YoutubeInterceptor } from './services/youtube.interceptor';

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    YoutubeRoutingModule,
    SharedModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: YoutubeInterceptor, multi: true }
  ]
})
export class YoutubeModule { }
