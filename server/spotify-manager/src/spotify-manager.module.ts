import { Module, HttpModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from './config/config.module';

import { UserController } from './controllers/user/user.controller';
import { PlaylistsController } from './controllers/playlists/playlists.controller';
import { LibraryController } from './controllers/library/library.controller';
import { BrowseController } from './controllers/browse/browse.controller';

import { SharedService } from './services/shared/shared.service';
import { PlaylistsService } from './services/playlists/playlists.service';
import { LibraryService } from './services/library/library.service';
import { SpotifyInterceptor } from './interceptors/spotify.interceptor';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [
    UserController,
    PlaylistsController,
    LibraryController,
    BrowseController
  ],
  providers: [
    SharedService,
    PlaylistsService,
    LibraryService,
    { provide: APP_INTERCEPTOR, useClass: SpotifyInterceptor }
  ],
})
export class SpotifyManagerModule { }
