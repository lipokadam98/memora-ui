import { Component, effect, inject } from '@angular/core';
import { NoteStore } from './note-store';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NoteCard } from './note-card/note-card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notes',
  imports: [
    MatButton,
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    TranslatePipe,
    NoteCard,
    MatIcon,
    MatProgressSpinner,
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  protected noteForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    content: new FormControl('', [Validators.required, Validators.maxLength(10000)]),
  });
  protected notesStore = inject(NoteStore);
  private snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);

  constructor() {
    effect(() => {
      if (this.notesStore.error()) {
        const message = this.translateService.instant('notes.load_error');
        this.snackBar.open(message, 'OK', { duration: 5000 });
        this.notesStore.clearError();
      }
    });
  }

  protected onAddNote() {
    const { title, content } = this.noteForm.value;
    if (!title || !content) {
      return;
    }
    this.notesStore.create(title, content);
  }
}
