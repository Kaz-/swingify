import { createMock } from '@golevelup/ts-jest';
import { INestApplication, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { of } from 'rxjs';

import { featuredPlaylists } from '../../../test/models/spotify.models.spec';
import { BrowseController } from './browse.controller';

describe('BrowseController', () => {
  let controller: BrowseController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BrowseController]
    }).compile();

    controller = module.get<BrowseController>(BrowseController);

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
