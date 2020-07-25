import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyManagerController } from './spotify-manager.controller';

describe('SpotifyManager Controller', () => {
  let controller: SpotifyManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotifyManagerController],
    }).compile();

    controller = module.get<SpotifyManagerController>(SpotifyManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
