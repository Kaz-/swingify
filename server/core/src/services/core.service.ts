import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';

import { SpotifyConfiguration } from '../schemas/spotify-configuration.schema';
import { YoutubeConfiguration } from '../schemas/youtube-configuration.schema';

@Injectable()
export class CoreService {

  constructor(
    @InjectModel(SpotifyConfiguration.name) private spotifyConfigurationModel: Model<SpotifyConfiguration>,
    @InjectModel(YoutubeConfiguration.name) private youtubeConfigurationModel: Model<YoutubeConfiguration>
  ) { }

  getSpotifyConfiguration(): Observable<SpotifyConfiguration> {
    return from(this.spotifyConfigurationModel.findOne().exec());
  }

  getYoutubeConfiguration(): Observable<YoutubeConfiguration> {
    return from(this.youtubeConfigurationModel.findOne().exec());
  }

}
