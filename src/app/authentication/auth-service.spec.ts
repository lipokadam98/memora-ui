import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;

  const activatedRouteMock = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      paramMap: {},
      queryParamMap: {},
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Router,
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
