import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaContent } from './multimedia-content';

describe('MultimediaContent', () => {
  let component: MultimediaContent;
  let fixture: ComponentFixture<MultimediaContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediaContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultimediaContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
