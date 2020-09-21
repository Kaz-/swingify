import { createMock } from '@golevelup/ts-jest';
import { INestApplication, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { of, EMPTY } from 'rxjs';
import { takeLast } from 'rxjs/operators';

import {
  spotifyConfiguration,
  authorizationHeader,
  tracksWithNext,
  tracksWithoutNext,
  mergedTracks,
  playlists,
  playlist,
  featuredPlaylists
} from '../../../test/models/spotify.models.spec';
import { PlaylistsService } from '../../services/playlists/playlists.service';
import { SharedService } from '../../services/shared/shared.service';
import { PlaylistsController } from './playlists.controller';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
  let sharedService: SharedService;
  let playlistsService: PlaylistsService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [PlaylistsController],
      providers: [
        {
          provide: SharedService,
          useValue: {
            getSpotifyConfiguration: jest.fn().mockReturnValue(of(spotifyConfiguration)),
            getAuthorizationHeader: jest.fn().mockReturnValue(authorizationHeader),
            findMatchInTrack: jest.fn().mockReturnValue(true),
            findMatchInArtists: jest.fn().mockReturnValue(true)
          }
        },
        {
          provide: PlaylistsService,
          useValue: {
            getTracksByRequest: jest.fn().mockReturnValueOnce(of(tracksWithNext)),
            getTracksByNext: jest.fn().mockReturnValue(of(tracksWithoutNext)),
            getTracksToAdd: jest.fn().mockReturnValue(EMPTY),
            getTracksToRemove: jest.fn().mockReturnValue(EMPTY),
            getCompleteTracklist: jest.fn().mockReturnValue(of(mergedTracks))
          }
        }
      ]
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
    sharedService = module.get<SharedService>(SharedService);
    playlistsService = module.get<PlaylistsService>(PlaylistsService);

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
      jest.spyOn(playlistsService, 'getTracksByNext')
        .mockReturnValueOnce(of(tracksWithNext))
        .mockReturnValueOnce(of(tracksWithoutNext));
      controller.getPlaylistTracks(req)
        .pipe(takeLast(1))
        .subscribe(res => {
          expect(playlistsService.getTracksByRequest).toHaveBeenCalledTimes(1);
          expect(playlistsService.getTracksByNext).toHaveBeenCalledTimes(2);
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
