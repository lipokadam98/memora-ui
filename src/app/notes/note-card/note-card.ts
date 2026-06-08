import { Component, inject, input } from '@angular/core';
import { NoteResponseDto } from '../../api';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { NoteContent } from '../note-content/note-content';

@Component({
  selector: 'app-note-card',
  imports: [DatePipe],
  templateUrl: './note-card.html',
  styleUrl: './note-card.css',
})
export class NoteCard {
  note = input.required<NoteResponseDto>();
  private dialog = inject(MatDialog);

  protected openNote() {
    this.dialog.open(NoteContent, {
      data: this.note(),
    });
  }
}
