import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpModule } from '@nestjs/common';
import { of, Subscription } from 'rxjs';
import { Request } from 'express';

import { SpotifyManagerController } from './spotify-manager.controller';
import { SpotifyManagerService } from '../services/spotify-manager.service';
import {
  spotifyConfiguration,
  playlists,
  user,
  tracksWithNext,
  tracksWithoutNext,
  authorizationHeader,
  playlist,
  mergedTracks
} from '../../test/models/spotify.models.spec';
import { createMock } from '../../test/mocks';
import { takeLast } from 'rxjs/operators';

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
            getTracksByRequest: jest.fn().mockReturnValueOnce(of(tracksWithNext)),
            getTracksByNext: jest.fn().mockReturnValue(of(tracksWithoutNext)),
            findMatchInTrack: jest.fn().mockReturnValue(true),
            findMatchInArtists: jest.fn().mockReturnValue(true)
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
      jest.spyOn(controller, 'getUserProfile').mockReturnValue(of(user));
      const subscription = controller.getUserProfile(req)
        .subscribe(res => expect(res).toEqual(user));
      subscriptions.push(subscription);
    });
  });

  describe(`/GET user's playlists`, () => {
    it(`should get the current user's playlists`, () => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getPlaylists').mockReturnValue(of(playlists));
      const subscription = controller.getPlaylists(req)
        .subscribe(res => expect(res).toEqual(playlists));
      subscriptions.push(subscription);
    });
  });

  describe(`/GET user's playlist by ID`, () => {
    it(`should get the current user's playlist by ID`, () => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getPlaylist').mockReturnValue(of(playlist));
      const subscription = controller.getPlaylist(req)
        .subscribe(res => expect(res).toEqual(playlist));
      subscriptions.push(subscription);
    });
  });

  describe(`/GET tracks with search query`, () => {
    it(`should get tracks according to the current query and merge all tracks`, () => {
      const req: Request = createMock<Request>({ query: { search: 'testQuery' } });
      // mock values with next to test expand and scan
      jest.spyOn(service, 'getTracksByNext')
        .mockReturnValueOnce(of(tracksWithNext))
        .mockReturnValueOnce(of(tracksWithoutNext));
      const subscription = controller.getPlaylistTracks(req)
        .pipe(takeLast(1)) // should have 7 tracks (2 + 2 + 4)
        .subscribe(res => expect(res).toEqual(mergedTracks));
      subscriptions.push(subscription);
    });
  });

});
