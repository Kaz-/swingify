import { createMock } from '@golevelup/ts-jest';
import { INestApplication, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { of } from 'rxjs';

import { authorizationHeader, spotifyConfiguration, user } from '../../../test/models/spotify.models.spec';
import { SharedService } from '../../services/shared/shared.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let service: SharedService;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [UserController],
      providers: [
        {
          provide: SharedService,
          useValue: {
            getSpotifyConfiguration: jest.fn().mockReturnValue(of(spotifyConfiguration)),
            getAuthorizationHeader: jest.fn().mockReturnValue(authorizationHeader)
          }
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<SharedService>(SharedService);

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

});
