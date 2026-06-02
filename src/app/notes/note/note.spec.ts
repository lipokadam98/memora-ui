import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Note } from './note';
import { NoteResponseDto } from '../../api';

describe('Note', () => {
  let component: Note;
  let fixture: ComponentFixture<Note>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Note],
    }).compileComponents();

    fixture = TestBed.createComponent(Note);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('note', {} as NoteResponseDto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
