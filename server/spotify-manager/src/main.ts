import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SpotifyManagerModule } from './spotify-manager.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(SpotifyManagerModule);
  app.setGlobalPrefix('api');
  app.disable('etag');
  await app.listen(7200);
}

bootstrap();