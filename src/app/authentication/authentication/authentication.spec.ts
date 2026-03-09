import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authentication } from './authentication';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('Authentication', () => {
  let component: Authentication;
  let fixture: ComponentFixture<Authentication>;

  const activatedRouteMock = {
    params: of({}),
    queryParams: of({}),
    snapshot: {
      paramMap: {},
      queryParamMap: {},
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authentication],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Authentication);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
