import { Component, inject } from '@angular/core';
import { NotesStore } from './notes-store';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  imports: [MatButton, MatInput, MatFormField, MatLabel, ReactiveFormsModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  protected notesStore = inject(NotesStore);

  ngOnInit() {
    this.notesStore.loadAll();
  }

  protected onAddNote() {
    this.notesStore.create('New note', 'Test content');
  }
}
