import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { of, EMPTY } from 'rxjs';

import { SpotifyManagerService } from './spotify-manager.service';
import { spotifyConfiguration, authorizationHeader, tracksWithNext, tracksWithoutNext, mergedTracks, user } from '../../test/models/spotify.models.spec';
import { createMock } from '@golevelup/ts-jest';

describe('SpotifyManagerService', () => {
  let service: SpotifyManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
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

    service = module.get<SpotifyManagerService>(SpotifyManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
