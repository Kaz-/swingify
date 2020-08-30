import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpModule } from '@nestjs/common';
import { of, Subscription } from 'rxjs';
import { Request } from 'express';

import { SpotifyManagerController } from './spotify-manager.controller';
import { SpotifyManagerService } from '../services/spotify-manager.service';
import { spotifyConfiguration, spotifyPlaylists, spotifyTracks, spotifyUser, authorizationHeader } from '../../test/models/spotify.models.spec';
import { createMock } from '../../test/mocks';

describe('SpotifyManager Controller', () => {
  let controller: SpotifyManagerController;
  let app: INestApplication;
  let service: SpotifyManagerService;
  let subscriptions: Subscription[] = [];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [SpotifyManagerController],
      providers: [
        {
          provide: SpotifyManagerService,
          useValue: {
            getSpotifyConfiguration: jest.fn().mockReturnValue(of(spotifyConfiguration)),
            getAuthorizationHeader: jest.fn().mockReturnValue(authorizationHeader),
            getTracksByRequest: jest.fn().mockReturnValue(of(spotifyPlaylists)),
            getTracksByNext: jest.fn().mockReturnValue(of(spotifyTracks)),
            getCompleteTracklist: jest.fn().mockReturnValue(of(spotifyTracks))
          }
        }
      ]
    }).compile();

    controller = module.get<SpotifyManagerController>(SpotifyManagerController);
    service = module.get<SpotifyManagerService>(SpotifyManagerService);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    subscriptions.forEach(subscription => subscription.unsubscribe());
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/GET spotify configuration', () => {
    it('should get the current Spotify Configuration', () => {
      return request(app.getHttpServer())
        .get('/spotify/configuration')
        .expect(200)
        .expect(spotifyConfiguration);
    });
  });

  describe('/GET current user', () => {
    it('should get the current user', () => {
      const req: Request = createMock<Request>();
      const subscription = controller.getUserProfile(req)
        .subscribe(res => expect(res).toEqual(spotifyUser));
      subscriptions.push(subscription);
    });
  });

});
