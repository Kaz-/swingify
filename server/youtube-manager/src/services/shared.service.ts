import { HttpService, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

import { Observable } from 'rxjs';

import { ConfigService } from '../config/config.service';
import { YoutubeConfiguration } from '../models/youtube.models';

@Injectable()
export class SharedService {

  private client: ClientProxy;

  constructor(
    private http: HttpService,
    private configService: ConfigService
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: this.configService.proxyConf
    });
  }

  get baseUrl(): string {
    return this.configService.baseUrl;
  }

  getYoutubeConfiguration(): Observable<YoutubeConfiguration> {
    // Sending empty string because there is no need to send any data
    return this.client.send('youtubeConfiguration', '');
  }

}
