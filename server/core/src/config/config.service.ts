import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {

  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
  }

  get database(): string {
    return this.envConfig.SWINGIFY_USERNAME && this.envConfig.SWINGIFY_PASSWORD
      ? `mongodb://${this.envConfig.SWINGIFY_USERNAME}:${this.envConfig.SWINGIFY_PASSWORD}@${this.envConfig.MONGO_HOST}:27017/swingify`
      : `mongodb://${this.envConfig.MONGO_HOST}:27017/swingify`;
  }

  get microserviceConfig(): { host: string, port: number } {
    return {
      host: this.envConfig.CORE_MICROSERVICE_HOST, // host MUST be '0.0.0.0' in docker (cf. https://github.com/nestjs/nest/issues/2532)
      port: parseInt(this.envConfig.CORE_MICROSERVICE_PORT)
    };
  }

}
