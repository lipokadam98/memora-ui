import { Component, inject, signal } from '@angular/core';
import { MultimediaService } from '../../multimedia-service';

@Component({
  selector: 'app-upload',
  imports: [],
  templateUrl: './upload.html',
  styleUrl: './upload.css',
})
export class Upload {
  selectedFile = signal<File | null>(null);
  private multimediaService = inject(MultimediaService);

  onFileSelected(event: any) {
    this.selectedFile.set(event.target.files[0]);
    console.log('Selected file:', this.selectedFile()?.arrayBuffer());
  }

  upload() {
    if (!this.selectedFile()) return;
    console.log('Uploading file:', this.selectedFile());
    this.multimediaService
      .uploadMultimedia(this.selectedFile()!)
      .then(() => console.log('File uploaded successfully'));
  }

  protected onRemoveFile() {
    this.selectedFile.set(null);
  }
}
