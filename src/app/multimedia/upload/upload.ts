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
  selectedFile = signal<File | null>(null);
  protected multimediaStore = inject(MultimediaStore);

  onFileSelected(event: any) {
    this.selectedFile.set(event.target.files[0]);
    console.log('Selected file:', this.selectedFile()?.arrayBuffer());
  }

  upload() {
    if (!this.selectedFile()) return;
    console.log('Uploading file:', this.selectedFile());
    this.multimediaStore.uploadMultimedia(this.selectedFile()!);
  }

  protected onRemoveFile() {
    this.selectedFile.set(null);
  }
}
