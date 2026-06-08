import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteContent } from './note-content';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('NoteContent', () => {
  let component: NoteContent;
  let fixture: ComponentFixture<NoteContent>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoteContent,
        RouterModule.forRoot([
          {
            path: 'authentication',
            component: DummyComponent,
          },
        ]),
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
