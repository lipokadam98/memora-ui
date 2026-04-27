import { Component, effect, inject, signal } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  ],
  providers: [provideNativeDateAdapter(), UploadStore],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  datePicker = new FormControl(new Date());
  isDragging = signal(false);

  protected uploadStore = inject(UploadStore);
  private notificationService = inject(NotificationService);
  private matDialogRef = inject(MatDialogRef);
  private translateService = inject(TranslateService);

  constructor() {
    effect(() => {
      const hasError = !this.uploadStore.success() && !!this.uploadStore.error();
      if (hasError || this.uploadStore.success()) {
        const prefix = hasError ? 'error' : 'success';
        const title = this.translateService.instant(`upload.${prefix}_title`);
        const text = this.translateService.instant(`upload.${prefix}_text`);
        const confirmButtonText = this.translateService.instant('common.ok');
        this.matDialogRef.close();
        this.notificationService.showMessage(title, text, confirmButtonText, prefix, false);
      }
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.uploadStore.setSelectedFiles(Array.from(input.files));
    input.value = '';
  }

  upload() {
    if (this.uploadStore.selectedFiles().length === 0 || !this.datePicker.value) return;
    console.log('Uploading files:', this.uploadStore.selectedFiles());
    this.uploadStore.upload(this.datePicker.value);
  }

  protected onRemoveFile() {
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
      this.uploadStore.setSelectedFiles(Array.from(files));
    }
  }
}
