import { NestFactory } from '@nestjs/core';
import { SpotifyManagerModule } from './spotify-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(SpotifyManagerModule);
  app.setGlobalPrefix('api');
  await app.listen(7200);
}
bootstrap();