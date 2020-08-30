import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { SpotifyConfiguration } from '../schemas/spotify-configuration.schema';

@Injectable()
export class CoreService {

  constructor(@InjectModel(SpotifyConfiguration.name) private spotifyConfigurationModel: Model<SpotifyConfiguration>) { }

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    return from(this.spotifyConfigurationModel.findOne().exec());
  }

}
