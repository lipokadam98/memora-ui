import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaThumbnail } from './multimedia-thumbnail';
import { MultimediaResponseDto } from '../../api';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

describe('MultimediaThumbnail', () => {
  let component: MultimediaThumbnail;
  let fixture: ComponentFixture<MultimediaThumbnail>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MultimediaThumbnail,
        TranslateModule.forRoot(),
        RouterModule.forRoot([
          {
            path: 'authentication',
            component: DummyComponent,
          },
        ]),
      ],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultimediaThumbnail);
    fixture.componentRef.setInput('multimedia', {} as MultimediaResponseDto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
