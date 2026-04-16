import { inject, Injectable } from '@angular/core';
import { MultimediaControllerService } from '../api';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from '../authentication/auth-store';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private multimediaControllerService = inject(MultimediaControllerService);
  private authStore = inject(AuthStore);

  async loadMultimediaData() {
    return await firstValueFrom(this.multimediaControllerService.getAll());
  }

  async uploadMultimedia(files: File[], date: Date) {
    return await firstValueFrom(
      this.multimediaControllerService.create(files, {
        user: this.authStore.loginData()?.user,
        uploadDate: date.toISOString(),
      }),
    );
  }

  async deleteMultimedia(id: number) {
    return await firstValueFrom(this.multimediaControllerService._delete(id));
  }
}
