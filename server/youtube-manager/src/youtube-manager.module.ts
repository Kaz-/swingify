import { HttpModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from './config/config.module';

import { UserController } from './controllers/user/user.controller';
import { PlaylistsController } from './controllers/playlists/playlists.controller';

import { SharedService } from './services/shared.service';
import { PlaylistsService } from './services/playlists.service';
import { YoutubeInterceptor } from './interceptors/youtube.interceptor';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [
    UserController,
    PlaylistsController
  ],
  providers: [
    SharedService,
    PlaylistsService,
    { provide: APP_INTERCEPTOR, useClass: YoutubeInterceptor }
  ],
})
export class YoutubeManagerModule { }
