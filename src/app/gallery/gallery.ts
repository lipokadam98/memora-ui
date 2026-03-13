import { Component, inject, OnInit, signal } from '@angular/core';
import { Image, MultimediaService } from '../multimedia-service';
import { ImageTile } from './image-tile/image-tile';

@Component({
  selector: 'app-gallery',
  imports: [ImageTile],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected images = signal<Image[]>([]);
  private multimediaService = inject(MultimediaService);

  ngOnInit() {
    this.loadImages().then(() => console.log('loaded the gallery images'));
  }

  private async loadImages() {
    const images = await this.multimediaService.loadImages();
    this.images.set(images);
  }
}
