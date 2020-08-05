import { TestBed } from '@angular/core/testing';

import { SpotifyInterceptor } from './spotify.interceptor';

describe('SpotifyInterceptor', () => {
  let service: SpotifyInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
