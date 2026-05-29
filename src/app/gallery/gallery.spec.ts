import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallery } from './gallery';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('Gallery', () => {
  let component: Gallery;
  let fixture: ComponentFixture<Gallery>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Gallery,
        TranslateModule.forRoot(),
        RouterModule.forRoot([
          {
            path: 'authentication',
            component: DummyComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Gallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
