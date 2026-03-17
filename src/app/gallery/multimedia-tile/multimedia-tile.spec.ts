import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaTile } from './multimedia-tile';
import { signal } from '@angular/core';
import { Multimedia } from '../../api';

describe('MultimediaTile', () => {
  let component: MultimediaTile;
  let fixture: ComponentFixture<MultimediaTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediaTile],
    }).compileComponents();

    const multimedia = signal<Multimedia>({} as Multimedia);
    fixture = TestBed.createComponent(MultimediaTile);
    fixture.componentRef.setInput('multimedia', multimedia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
