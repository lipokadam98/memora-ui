import { Component, inject, signal } from '@angular/core';
import { MultimediaStore } from '../multimedia-store';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-upload',
  imports: [MatProgressBar, TranslatePipe, MatButton],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  selectedFiles = signal<File[]>([]);
  protected multimediaStore = inject(MultimediaStore);

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  upload() {
    if (this.selectedFiles().length === 0) return;
    console.log('Uploading files:', this.selectedFiles());
    this.multimediaStore.uploadMultimedia(this.selectedFiles());
  }

  protected onRemoveFile() {
    this.selectedFiles.set([]);
  }
}
