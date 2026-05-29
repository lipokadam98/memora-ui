import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Welcome } from './welcome';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

describe('Welcome', () => {
  let component: Welcome;
  let fixture: ComponentFixture<Welcome>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Welcome,
        TranslateModule.forRoot(),
        RouterModule.forRoot([{ path: 'authentication', component: DummyComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Welcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
