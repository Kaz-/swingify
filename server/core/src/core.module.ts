import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { environment } from 'environment';
import { CoreController } from './controllers/core.controller';
import { CoreService } from './services/core.service';
import { SpotifyConfiguration, SpotifyConfigurationSchema } from './schemas/spotify-configuration.schema';


@Module({
  imports: [
    MongooseModule.forRoot(environment.database),
    MongooseModule.forFeature([{ name: SpotifyConfiguration.name, schema: SpotifyConfigurationSchema }])
  ],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
