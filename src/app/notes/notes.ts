import { Component, effect, inject, signal } from '@angular/core';
import { NoteStore } from './note-store';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { NoteCard } from './note-card/note-card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NotificationService } from '../util/notification-service';
import { form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';

interface NoteData {
  title: string;
  content: string;
}

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
    FormRoot,
    FormField,
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes {
  protected notesStore = inject(NoteStore);
  private notificationService = inject(NotificationService);

  private noteModel = signal<NoteData>({
    title: '',
    content: '',
  });

  protected noteForm = form(
    this.noteModel,
    (schemaPath) => {
      required(schemaPath.title, { message: 'required' });
      required(schemaPath.content, { message: 'required' });
      maxLength(schemaPath.title, 150, { message: 'maxLength' });
      maxLength(schemaPath.content, 10000, { message: 'maxLength' });
    },
    {
      submission: {
        action: async (field) => {
          const { title, content } = field().value();
          if (!title || !content) {
            return;
          }
          await this.notesStore.create(title, content);
        },
      },
    },
  );

  constructor() {
    effect(() => {
      if (this.notesStore.error() && this.notesStore.errorType()) {
        const errorType = this.notesStore.errorType();
        this.notificationService.showSnackBar(`notes.error.${errorType}`);
        this.notesStore.clearError();
      }
    });
  }
}
