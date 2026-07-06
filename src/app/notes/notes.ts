import { Component, effect, inject } from '@angular/core';
import { NoteStore } from './note-store';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { NoteCard } from './note-card/note-card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NotificationService } from '../util/notification-service';

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
    MatIconButton,
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
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.notesStore.error() && this.notesStore.errorType()) {
        const errorType = this.notesStore.errorType();
        this.notificationService.showSnackBar(`notes.error.${errorType}`);
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
