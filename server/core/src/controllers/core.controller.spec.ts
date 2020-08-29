import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoreController } from './core.controller';
import { CoreService } from '../services/core.service';
import { SpotifyConfiguration } from 'src/schemas/spotify-configuration.schema';

describe('Core Controller', () => {
  let controller: CoreController;
  let service: CoreService;
  let model: Model<SpotifyConfiguration>;

  const config = { clientId: 'testClient', clientSecret: 'testSecret' };

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
