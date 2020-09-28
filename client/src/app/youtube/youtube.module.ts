import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AuthService } from './services/auth.service';

import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';

import { AuthGuard } from '../youtube/guards/auth.guard';

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
    AuthGuard
  ]
})
export class YoutubeModule { }
