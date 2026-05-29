import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Upload } from './upload';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('Upload', () => {
  let component: Upload;
  let fixture: ComponentFixture<Upload>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Upload,
        TranslateModule.forRoot(),
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

    fixture = TestBed.createComponent(Upload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
