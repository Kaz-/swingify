import { TestBed } from '@angular/core/testing';

import { YoutubeAuthService } from './youtube-auth.service';

describe('YoutubeAuthService', () => {
  let service: YoutubeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
