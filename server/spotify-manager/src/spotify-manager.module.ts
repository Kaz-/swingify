import { Module, HttpModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from './config/config.module';

import { SpotifyManagerController } from './controllers/spotify-manager.controller';
import { SpotifyManagerService } from './services/spotify-manager.service';
import { SpotifyInterceptor } from './interceptors/spotify.interceptor';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [SpotifyManagerController],
  providers: [
    SpotifyManagerService,
    { provide: APP_INTERCEPTOR, useClass: SpotifyInterceptor }
  ],
})
export class SpotifyManagerModule { }
