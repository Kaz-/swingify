import { Module } from '@nestjs/common';

import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [],
  controllers: [
    UserController
  ],
  providers: [],
})
export class YoutubeManagerModule { }
