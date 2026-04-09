import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaThumbnail } from './multimedia-thumbnail';
import { MultimediaResponseDto } from '../../api';
import { provideHttpClient } from '@angular/common/http';

describe('MultimediaThumbnail', () => {
  let component: MultimediaThumbnail;
  let fixture: ComponentFixture<MultimediaThumbnail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediaThumbnail],
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
