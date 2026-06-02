import { Component, input } from '@angular/core';
import { NoteResponseDto } from '../../api';

@Component({
  selector: 'app-note',
  imports: [],
  templateUrl: './note.html',
  styleUrl: './note.css',
})
export class Note {
  note = input.required<NoteResponseDto>();
}
