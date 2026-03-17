import { Injectable } from '@angular/core';
import { Multimedia } from './api';

@Injectable({
  providedIn: 'root',
})
export class MultimediaService {
  async loadMultimediaData(): Promise<Multimedia[]> {
    return [];
  }
}
