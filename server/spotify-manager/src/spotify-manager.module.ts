import { Module, HttpModule } from '@nestjs/common';

import { SpotifyManagerController } from './controllers/spotify-manager.controller';

import { SpotifyManagerService } from './services/spotify-manager.service';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyManagerController],
  providers: [SpotifyManagerService],
})
export class SpotifyManagerModule {}
