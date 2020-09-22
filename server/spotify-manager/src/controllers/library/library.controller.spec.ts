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
  noTracks
} from '../../../test/models/spotify.models.spec';
import { LibraryService } from '../../services/library.service';
import { SharedService } from '../../services/shared.service';
import { LibraryController } from './library.controller';

describe('LibraryController', () => {
  let controller: LibraryController;
  let sharedService: SharedService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [LibraryController],
      providers: [
        {
          provide: SharedService,
          useValue: {
            getSpotifyConfiguration: jest.fn().mockReturnValue(of(spotifyConfiguration)),
            getAuthorizationHeader: jest.fn().mockReturnValue(authorizationHeader),
            findMatchInTrack: jest.fn().mockReturnValue(true),
            findMatchInArtists: jest.fn().mockReturnValue(true),
            getTracksByRequest: jest.fn().mockReturnValueOnce(of(tracksWithNext)),
            getTracksByNext: jest.fn().mockReturnValue(of(tracksWithoutNext)),
            getCompleteTracklist: jest.fn().mockReturnValue(of(mergedTracks)),
            getSavedTracksByRequest: jest.fn().mockReturnValueOnce(of(tracksWithNext)),
            getSavedTracksByNext: jest.fn().mockReturnValue(of(tracksWithoutNext)),
            getCompleteSavedTracklist: jest.fn().mockReturnValue(of(mergedTracks))
          }
        },
        {
          provide: LibraryService,
          useValue: {
            getTracksToSave: jest.fn().mockReturnValue(EMPTY),
            getSavedTracksToRemove: jest.fn().mockReturnValue(EMPTY),
          }
        }
      ]
    }).compile();

    controller = module.get<LibraryController>(LibraryController);
    sharedService = module.get<SharedService>(SharedService);

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

  describe(`/GET tracks with search query`, () => {
    it(`should get tracks according to the current query and merge all tracks`, done => {
      const req: Request = createMock<Request>({ query: { search: 'Joey Bada$$' } });
      jest.spyOn(sharedService, 'getSavedTracksByNext')
        .mockReturnValueOnce(of(tracksWithNext))
        .mockReturnValueOnce(of(tracksWithoutNext));
      controller.getSavedTracks(req)
        .pipe(takeLast(1))
        .subscribe(res => {
          expect(sharedService.getSavedTracksByRequest).toHaveBeenCalledTimes(1);
          expect(sharedService.getSavedTracksByNext).toHaveBeenCalledTimes(2);
          expect(res).toEqual(mergedTracks);
          done();
        });
    });
  });

  describe(`/GET tracks with wrong search query`, () => {
    it(`should get tracks according to the current query and return no tracks`, done => {
      const req: Request = createMock<Request>({ query: { search: 'wrongQuery' } });
      jest.spyOn(sharedService, 'getSavedTracksByNext')
        .mockReturnValueOnce(of(tracksWithNext))
        .mockReturnValueOnce(of(tracksWithoutNext));
      controller.getSavedTracks(req)
        .pipe(takeLast(1))
        .subscribe(res => {
          expect(sharedService.getSavedTracksByRequest).toHaveBeenCalledTimes(1);
          expect(sharedService.getSavedTracksByNext).toHaveBeenCalledTimes(2);
          expect(res).toEqual(noTracks);
          done();
        });
    });
  });

});
