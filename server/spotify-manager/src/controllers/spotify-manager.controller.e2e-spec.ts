import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpModule } from '@nestjs/common';
import { Request } from 'express';
import { of, EMPTY } from 'rxjs';
import { takeLast } from 'rxjs/operators';
import { createMock } from '@golevelup/ts-jest';

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
  mergedTracks,
  featuredPlaylists
} from '../../test/models/spotify.models.spec';


describe('SpotifyManager Controller e2e tests', () => {
  let controller: SpotifyManagerController;
  let app: INestApplication;
  let service: SpotifyManagerService;

  beforeEach(async () => {
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
            getTracksToAdd: jest.fn().mockReturnValue(EMPTY),
            getTracksToRemove: jest.fn().mockReturnValue(EMPTY),
            getCompleteTracklist: jest.fn().mockReturnValue(of(mergedTracks)),
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

  afterEach(async () => {
    jest.resetAllMocks();
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
    it('should get the current user', done => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getUserProfile').mockReturnValue(of(user));
      controller.getUserProfile(req)
        .subscribe(res => {
          expect(res).toEqual(user);
          done();
        });
    });
  });

  describe(`/GET user's playlists`, () => {
    it(`should get the current user's playlists`, done => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getPlaylists').mockReturnValue(of(playlists));
      controller.getPlaylists(req)
        .subscribe(res => {
          expect(res).toEqual(playlists);
          done();
        });
    });
  });

  describe(`/GET user's playlist by ID`, () => {
    it(`should get the current user's playlist by ID`, done => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getPlaylist').mockReturnValue(of(playlist));
      controller.getPlaylist(req)
        .subscribe(res => {
          expect(res).toEqual(playlist);
          done();
        });
    });
  });

  describe(`/GET tracks with search query`, () => {
    it(`should get tracks according to the current query and merge all tracks`, done => {
      const req: Request = createMock<Request>({ query: { search: 'testQuery' } });
      jest.spyOn(service, 'getTracksByNext')
        .mockReturnValueOnce(of(tracksWithNext))
        .mockReturnValueOnce(of(tracksWithoutNext));
      controller.getPlaylistTracks(req)
        .pipe(takeLast(1))
        .subscribe(res => {
          expect(service.getTracksByRequest).toHaveBeenCalledTimes(1);
          expect(service.getTracksByNext).toHaveBeenCalledTimes(2);
          expect(res).toEqual(mergedTracks);
          done();
        });
    });
  });

  describe(`/POST new playlist`, () => {
    it(`should create a new playlist`, done => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'createPlaylist').mockReturnValue(of(playlist));
      controller.createPlaylist(req)
        .subscribe(res => {
          expect(res).toEqual(playlist);
          done();
        });
    });
  });

  describe(`/GET featured playlists`, () => {
    it(`should get featured playlists from current locale`, done => {
      const req: Request = createMock<Request>();
      jest.spyOn(controller, 'getFeaturedPlaylists').mockReturnValue(of(featuredPlaylists));
      controller.getFeaturedPlaylists(req)
        .subscribe(res => {
          expect(res).toEqual(featuredPlaylists);
          done();
        });
    });
  });

});
