import { Component, inject } from '@angular/core';
import { NotesStore } from './notes-store';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notes',
  imports: [MatButton, MatInput, MatFormField, MatLabel, ReactiveFormsModule, TranslatePipe],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  protected noteForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });
  protected notesStore = inject(NotesStore);

  ngOnInit() {
    this.notesStore.loadAll();
  }

  protected onAddNote() {
    const { title, content } = this.noteForm.value;
    if (!title || !content) {
      return;
    }
    this.notesStore.create(title, content);
  }
}
