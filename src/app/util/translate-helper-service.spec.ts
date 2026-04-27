import { TestBed } from '@angular/core/testing';

import { TranslateHelperService } from './translate-helper-service';

describe('TranslateHelperService', () => {
  let service: TranslateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
