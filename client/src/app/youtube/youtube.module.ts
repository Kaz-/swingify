import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

import { AuthService } from './services/auth.service';

import { MainComponent } from './components/main/main.component';

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    YoutubeRoutingModule,
    SharedModule,
  ],
  providers: [
    AuthService
  ]
})
export class YoutubeModule { }
