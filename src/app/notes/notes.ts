import { Component, inject, OnInit, signal } from '@angular/core';
import { Note, NotesService } from './notes-service';

@Component({
  selector: 'app-notes',
  imports: [],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes implements OnInit {
  notes = signal<Note[]>([]);
  protected notesService = inject(NotesService);

  ngOnInit() {
    this.loadNotes().then(() => console.log('loaded the notes'));
  }

  private async loadNotes() {
    const notes = await this.notesService.loadNotes();
    this.notes.set(notes);
  }
}
