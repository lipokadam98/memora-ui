import { inject, Injectable } from '@angular/core';
import {
  Multimedia,
  MultimediaControllerService,
  MultimediaRequestDto,
  MultimediaResponseDto,
} from './api';
import { AuthService } from './authentication/auth-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  private multimediaControllerService = inject(MultimediaControllerService);
  private authService = inject(AuthService);

  async loadMultimediaData(): Promise<MultimediaResponseDto[]> {
    return await firstValueFrom(this.multimediaControllerService.getAll());
  }

  async uploadMultimedia(file: File): Promise<Multimedia> {
    const multimedia: MultimediaRequestDto = {
      user: this.authService.userData()!,
    };
    console.log('Uploading multimedia:', multimedia);
    return await firstValueFrom(this.multimediaControllerService.create1(file, multimedia));
  }
}
