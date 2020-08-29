import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyManagerService } from './spotify-manager.service';
import { ClientProxy } from '@nestjs/microservices';

describe('SpotifyManagerService', () => {
  let service: SpotifyManagerService;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyManagerService],
    }).compile();

    service = module.get<SpotifyManagerService>(SpotifyManagerService);
    client = module.get<ClientProxy>('CLIENT_PROXY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSpotifyConfiguration', () => {
    it('should send an event to the core', () => {

    });
  });
});
