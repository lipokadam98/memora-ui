import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UploadStore } from './upload-store';
import { NotificationService } from '../../util/notification-service';

@Component({
  selector: 'app-upload',
  imports: [
    MatProgressBar,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatDatepickerInput,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatIcon,
    TranslatePipe,
    ReactiveFormsModule,
    MatIconButton,
  ],
  providers: [provideNativeDateAdapter(), UploadStore],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  datePicker = new FormControl(null, Validators.required);
  isDragging = signal(false);

  protected uploadStore = inject(UploadStore);
  private notificationService = inject(NotificationService);
  private matDialogRef = inject(MatDialogRef);

  constructor() {
    effect(() => {
      const hasError = !this.uploadStore.success() && !!this.uploadStore.error();
      if (hasError || this.uploadStore.success()) {
        const prefix = hasError ? 'error' : 'success';
        this.matDialogRef.close();
        this.notificationService.showMessage(
          `upload.${prefix}_title`,
          `upload.${prefix}_text`,
          'common.ok',
          prefix,
          false,
        );
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): string | void {
    if (this.uploadStore.isUploading()) {
      $event.preventDefault();
      return '';
    }
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.uploadStore.setSelectedFiles(Array.from(input.files));
    input.value = '';
  }

  upload() {
    if (this.uploadStore.selectedFiles().length === 0 || !this.datePicker.value) return;
    this.uploadStore.upload(this.datePicker.value);
  }

  protected onRemoveFiles() {
    this.uploadStore.clearSelectedFiles();
  }

  protected onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;

    if (files) {
      const fileArray = Array.from(files);
      const isImageOrVideo = fileArray.every(
        (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
      );
      if (!isImageOrVideo) {
        return;
      }
      this.uploadStore.setSelectedFiles(fileArray);
    }
  }
}
