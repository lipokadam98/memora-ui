import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCard } from './note-card';
import { NoteResponseDto } from '../../api';

describe('NoteCard', () => {
  let component: NoteCard;
  let fixture: ComponentFixture<NoteCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteCard],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('note', {} as NoteResponseDto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
