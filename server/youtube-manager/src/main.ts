import { NestFactory } from '@nestjs/core';
import { YoutubeManagerModule } from './youtube-manager.module';

async function bootstrap() {
  const app = await NestFactory.create(YoutubeManagerModule);
  app.setGlobalPrefix('api/youtube');
  await app.listen(7300);
}

bootstrap();
