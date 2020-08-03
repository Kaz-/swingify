import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'spotifyConfiguration' })
export class SpotifyConfiguration extends Document {
  @Prop()
  clientId: string;

  @Prop()
  clientSecret: string;
}

export const SpotifyConfigurationSchema = SchemaFactory.createForClass(SpotifyConfiguration);