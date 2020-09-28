import { TestBed } from '@angular/core/testing';

import { YoutubeInterceptor } from './youtube.interceptor';

describe('YoutubeService', () => {
  let service: YoutubeInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
