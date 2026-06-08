import { Component, inject } from '@angular/core';
import { NoteStore } from '../note-store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoteResponseDto } from '../../api';
import { DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-note-content',
  imports: [DatePipe, MatIcon, MatIconButton],
  templateUrl: './note-content.html',
  styleUrl: './note-content.css',
})
export class NoteContent {
  protected note = inject(MAT_DIALOG_DATA) as NoteResponseDto;
  private store = inject(NoteStore);
  private matDialogRef = inject(MatDialogRef);

  protected deleteNote() {
    const id = this.note.id;
    if (!id) {
      return;
    }
    this.store.deleteById(id).then(() => this.matDialogRef.close());
  }
}
