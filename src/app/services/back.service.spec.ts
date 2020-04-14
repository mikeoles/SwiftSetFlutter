import { TestBed } from '@angular/core/testing';

import { BackService } from './back.service';

describe('BackService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackService = TestBed.get(BackService);
    expect(service).toBeTruthy();
  });
});
