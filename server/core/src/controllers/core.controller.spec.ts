import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, DocumentQuery } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';

import { CoreController } from './core.controller';
import { CoreService } from '../services/core.service';
import { SpotifyConfiguration } from '../schemas/spotify-configuration.schema';

describe('Core Controller', () => {
  let controller: CoreController;
  let service: CoreService;
  let model: Model<SpotifyConfiguration>;

  const config = { clientId: 'testClient', clientSecret: 'testSecret' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        CoreService,
        {
          provide: getModelToken('SpotifyConfiguration'),
          useValue: {
            new: jest.fn().mockResolvedValue(config),
            constructor: jest.fn().mockResolvedValue(config),
            findOne: jest.fn(),
            exec: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<CoreController>(CoreController);
    service = module.get<CoreService>(CoreService);
    model = module.get<Model<SpotifyConfiguration>>(getModelToken('SpotifyConfiguration'));
  });

  afterAll(async () => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSpotifyConfiguration', () => {
    it('should return the current spotify configuration', done => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<DocumentQuery<SpotifyConfiguration, SpotifyConfiguration, unknown>>({
          exec: jest.fn().mockResolvedValueOnce(config)
        })
      );
      service.getSpotifyConfiguration()
        .subscribe(result => {
          expect(result).toEqual(config);
          done();
        });
    });
  });
});
