import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions, TcpOptions } from '@nestjs/microservices';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { Logger } from '@nestjs/common';

import { CoreModule } from './core.module';
import { ConfigService } from './config/config.service';

const logger = new Logger('Core');

const microserviceOptions: (NestApplicationContextOptions & TcpOptions) = {
  transport: Transport.TCP
};

async function bootstrap() {
  const configService: ConfigService = new ConfigService();
  microserviceOptions.options = configService.microserviceConfig;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(CoreModule, microserviceOptions);
  app.listen(() => logger.log('Microservice is listening'));
}
bootstrap();
