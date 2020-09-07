import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

@Injectable()
export class ConfigService {

  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
  }

  get proxyConf(): { host: string, port: number } {
    return {
      host: this.envConfig.CORE_PROXY_HOST,
      port: parseInt(this.envConfig.CORE_PROXY_PORT)
    }
  }

}
