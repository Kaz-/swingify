import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, DocumentQuery } from 'mongoose';
import { Subscription } from 'rxjs';

import { CoreService } from './core.service';
import { SpotifyConfiguration } from '../schemas/spotify-configuration.schema';
import { createMock } from '../../test/mocks';

describe('CoreService', () => {
  let service: CoreService;
  let model: Model<SpotifyConfiguration>;
  let subscriptions: Subscription[] = [];

  const config = { clientId: 'testClient', clientSecret: 'testSecret' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    model = module.get<Model<SpotifyConfiguration>>(getModelToken('SpotifyConfiguration'));
  });

  afterAll(async () => {
    jest.resetAllMocks();
    subscriptions.forEach(subscription => subscription.unsubscribe());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpotifyConfiguration', () => {
    it('should return the current spotify configuration', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<DocumentQuery<SpotifyConfiguration, SpotifyConfiguration, unknown>>({
          exec: jest.fn().mockResolvedValueOnce(config)
        })
      );
      const subscription = service.getSpotifyConfiguration()
        .subscribe(result => expect(result).toEqual(config));
      subscriptions.push(subscription);
    });
  });
});
