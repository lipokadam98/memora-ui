import { Component, inject, OnInit, signal } from '@angular/core';
import { Image, ImageService } from '../image-service';
import { ImageTile } from './image-tile/image-tile';

@Component({
  selector: 'app-gallery',
  imports: [ImageTile],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  loadedImages = signal<Image[]>([]);
  imageService = inject(ImageService);

  ngOnInit() {
    this.loadImages().then(() => console.log('loaded the images'));
  }

  private async loadImages() {
    const images = await this.imageService.loadImages();
    this.loadedImages.set(images);
  }
}
