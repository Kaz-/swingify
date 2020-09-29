import { HttpService, Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../config/environment';

import { ConfigService } from '../config/config.service';
import { Details, Snippet, YoutubeConfiguration, YoutubePaging } from '../models/youtube.models';

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

  static getAuthorizationHeader(request: Request): any {
    return {
      Authorization: request.headers['authorization'] ? request.headers['authorization'] : null,
      'Content-Type': 'application/json'
    };
  }

  getYoutubeConfiguration(): Observable<YoutubeConfiguration> {
    // Sending empty string because there is no need to send any data
    return this.client.send('youtubeConfiguration', '');
  }

  getUser(request: Request): Observable<Details<Snippet>> {
    return this.http.get<YoutubePaging<Snippet>>(
      `${environment.apiBaseUrl}/channels`,
      {
        params: { mine: true, part: 'snippet' },
        headers: SharedService.getAuthorizationHeader(request)
      }
    ).pipe(map(response => response.data.items[0]));
  }

}
