import { Component, inject, signal } from '@angular/core';
import { MultimediaStore } from '../multimedia-store';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthStore } from '../../authentication/auth-store';

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
  providers: [provideNativeDateAdapter()],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  datePicker = new FormControl(new Date());
  selectedFiles = signal<File[]>([]);
  protected multimediaStore = inject(MultimediaStore);
  private authStore = inject(AuthStore);

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  upload() {
    if (
      this.selectedFiles().length === 0 ||
      !this.datePicker.value ||
      !this.authStore.loginData()?.user
    )
      return;
    console.log('Uploading files:', this.selectedFiles());
    this.multimediaStore.upload(
      this.selectedFiles(),
      this.datePicker.value,
      this.authStore.loginData()?.user,
    );
  }

  protected onRemoveFile() {
    this.selectedFiles.set([]);
  }
}
