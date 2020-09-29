import { TestBed } from '@angular/core/testing';

import { GlobalInterceptor } from './global.interceptor';

describe('YoutubeService', () => {
  let service: GlobalInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
