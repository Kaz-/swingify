import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'youtubeConfiguration' })
export class YoutubeConfiguration extends Document {
  @Prop()
  client_id: string;

  @Prop()
  project_id: string;

  @Prop()
  auth_uri: string;

  @Prop()
  token_uri: string;

  @Prop()
  auth_provider_x509_cert_url: string;

  @Prop()
  client_secret: string;

  @Prop()
  redirect_uris: string[];
}

export const YoutubeConfigurationSchema = SchemaFactory.createForClass(YoutubeConfiguration);
