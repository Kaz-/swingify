import { Module } from '@nestjs/common';
import { CoreController } from './controllers/core.controller';

@Module({
  imports: [],
  controllers: [CoreController],
  providers: [],
})
export class CoreModule {}
