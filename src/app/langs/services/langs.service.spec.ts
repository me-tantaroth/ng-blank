import { TestBed } from '@angular/core/testing';

import { LangsService } from './langs.service';

describe('LangsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LangsService = TestBed.get(LangsService);
    expect(service).toBeTruthy();
  });
});
