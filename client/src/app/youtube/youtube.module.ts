import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

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
    YoutubeRoutingModule,
    SharedModule
  ],
  providers: [
    AuthGuard
  ]
})
export class YoutubeModule { }
