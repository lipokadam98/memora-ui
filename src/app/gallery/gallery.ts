import { Component, inject, OnInit, signal } from '@angular/core';
import { MultimediaService } from '../multimedia-service';
import { MultimediaTile } from './multimedia-tile/multimedia-tile';
import { Multimedia } from '../api';

@Component({
  selector: 'app-gallery',
  imports: [MultimediaTile],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected multimediaData = signal<Multimedia[]>([]);
  private multimediaService = inject(MultimediaService);

  ngOnInit() {
    this.loadImages().then(() => console.log('loaded the gallery images'));
  }

  private async loadImages() {
    const data = await this.multimediaService.loadMultimediaData();
    this.multimediaData.set(data);
  }
}
