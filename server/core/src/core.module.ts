import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CoreController } from './controllers/core.controller';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { CoreService } from './services/core.service';

import { SpotifyConfiguration, SpotifyConfigurationSchema } from './schemas/spotify-configuration.schema';
import { YoutubeConfiguration, YoutubeConfigurationSchema } from './schemas/youtube-configuration.schema';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({ uri: configService.database }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { name: SpotifyConfiguration.name, schema: SpotifyConfigurationSchema },
      { name: YoutubeConfiguration.name, schema: YoutubeConfigurationSchema }
    ])
  ],
  controllers: [CoreController],
  providers: [CoreService]
})
export class CoreModule { }
