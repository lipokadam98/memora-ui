import { Component, inject } from '@angular/core';
import { NotesStore } from './notes-store';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  protected notesStore = inject(NotesStore);
}
