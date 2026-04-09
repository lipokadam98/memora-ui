import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaTile } from './multimedia-tile';
import { MultimediaResponseDto } from '../../api';
import { provideHttpClient } from '@angular/common/http';

describe('MultimediaTile', () => {
  let component: MultimediaTile;
  let fixture: ComponentFixture<MultimediaTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediaTile],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MultimediaTile);
    fixture.componentRef.setInput('multimedia', {} as MultimediaResponseDto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
