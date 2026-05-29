import { TestBed } from '@angular/core/testing';

import { TranslateHelperService } from './translate-helper-service';
import { TranslateModule } from '@ngx-translate/core';

describe('TranslateHelperService', () => {
  let service: TranslateHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(TranslateHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
