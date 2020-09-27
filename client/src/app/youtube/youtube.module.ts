import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { YoutubeRoutingModule } from './youtube-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    YoutubeRoutingModule,
    SharedModule,
  ],
  providers: []
})
export class YoutubeModule { }
