import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notes } from './notes';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Notes,
        RouterModule.forRoot([
          {
            path: 'authentication',
            component: DummyComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
