import { inject, Injectable } from '@angular/core';
import { Multimedia, MultimediaControllerService } from './api';
import { AuthService } from './authentication/auth-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private multimediaControllerService = inject(MultimediaControllerService);
  private authService = inject(AuthService);

  async loadMultimediaData(): Promise<Multimedia[]> {
    return [];
  }

  async uploadMultimedia(file: File): Promise<Multimedia> {
    const data = await file.arrayBuffer();
    console.log('File data:', data);
    const multimedia: Multimedia = {
      bucketName: 'memora-ui',
      originalFileName: file.name,
      contentType: file.type,
      size: file.size,
      objectKey: file.name,
      user: this.authService.userData()!,
    };
    console.log('Uploading multimedia:', multimedia);
    return await firstValueFrom(this.multimediaControllerService.create1(multimedia));
  }
}
