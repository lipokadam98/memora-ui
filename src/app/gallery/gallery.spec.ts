import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallery } from './gallery';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('Gallery', () => {
  let component: Gallery;
  let fixture: ComponentFixture<Gallery>;

  class IntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];

    disconnect() {
      return null;
    }

    observe() {
      return null;
    }

    takeRecords() {
      return [];
    }

    unobserve() {
      return null;
    }
  }

  @Component({ template: '' })
  class DummyComponent {}

  window.IntersectionObserver = IntersectionObserver;

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
