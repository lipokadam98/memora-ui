import { Component, input } from '@angular/core';
import { NoteResponseDto } from '../../api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-note',
  imports: [DatePipe],
  templateUrl: './note.html',
  styleUrl: './note.css',
})
export class Note {
  note = input.required<NoteResponseDto>();
}
