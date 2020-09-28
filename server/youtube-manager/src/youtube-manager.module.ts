import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';

import { UserController } from './controllers/user/user.controller';
import { SharedService } from './services/shared.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    SharedService
  ],
})
export class YoutubeManagerModule { }
