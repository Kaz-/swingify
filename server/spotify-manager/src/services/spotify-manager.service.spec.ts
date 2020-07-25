import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyManagerService } from './spotify-manager.service';

describe('SpotifyManagerService', () => {
  let service: SpotifyManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyManagerService],
    }).compile();

    service = module.get<SpotifyManagerService>(SpotifyManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
