import { Injectable } from '@angular/core';
import images from './dummy-data/images.json';

export interface Image {
  id: string;
  src: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  async loadImages(): Promise<Image[]> {
    return images;
  }
}
