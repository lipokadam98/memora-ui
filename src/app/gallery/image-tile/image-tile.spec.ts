import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTile } from './image-tile';
import { signal } from '@angular/core';
import { Image } from '../../multimedia-service';

describe('ImageTile', () => {
  let component: ImageTile;
  let fixture: ComponentFixture<ImageTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageTile],
    }).compileComponents();

    const image = signal<Image>({} as Image);
    fixture = TestBed.createComponent(ImageTile);
    fixture.componentRef.setInput('image', image);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
