import { inject, Injectable } from '@angular/core';
import { MultimediaControllerService, MultimediaRequestDto } from '../api';
import { AuthService } from '../authentication/auth-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private multimediaControllerService = inject(MultimediaControllerService);
  private authService = inject(AuthService);

  async loadMultimediaData() {
    return await firstValueFrom(this.multimediaControllerService.getAll());
  }

  async uploadMultimedia(files: File[], date: Date) {
    const multimedia: MultimediaRequestDto = {
      user: this.authService.loginData()?.user,
      uploadDate: date.toISOString(),
    };
    console.log('Uploading multimedia:', multimedia);
    return await firstValueFrom(this.multimediaControllerService.create(files, multimedia));
  }

  async deleteMultimedia(id: number) {
    return await firstValueFrom(this.multimediaControllerService._delete(id));
  }
}
