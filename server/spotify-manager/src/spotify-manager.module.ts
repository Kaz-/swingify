import { Module, HttpModule } from '@nestjs/common';

import { SpotifyManagerController } from './controllers/spotify-manager.controller';

import { SpotifyManagerService } from './services/spotify-manager.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [HttpModule],
  controllers: [SpotifyManagerController],
  providers: [SpotifyManagerService, AuthService],
})
export class SpotifyManagerModule {}
