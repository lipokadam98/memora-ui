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

  async uploadMultimedia(file: File) {
    const multimedia: MultimediaRequestDto = {
      user: this.authService.loginData()?.user,
    };
    console.log('Uploading multimedia:', multimedia);
    return await firstValueFrom(this.multimediaControllerService.create(file, multimedia));
  }

  async deleteMultimedia(id: number) {
    return await firstValueFrom(this.multimediaControllerService._delete(id));
  }
}
