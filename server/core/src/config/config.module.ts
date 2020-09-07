import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';


@Module({
  imports: [NestConfigModule],
  exports: [ConfigService],
  providers: [ConfigService]
})
export class ConfigModule { }
