import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageTile } from './image-tile';

describe('ImageTile', () => {
  let component: ImageTile;
  let fixture: ComponentFixture<ImageTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageTile],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageTile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
