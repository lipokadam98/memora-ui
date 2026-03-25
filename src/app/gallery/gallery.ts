import { Component, inject, OnInit, signal } from '@angular/core';
import { MultimediaService } from '../multimedia-service';
import { MultimediaTile } from './multimedia-tile/multimedia-tile';
import { MultimediaResponseDto } from '../api';
import { Upload } from './upload/upload';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gallery',
  imports: [MultimediaTile, Upload, RouterOutlet],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected multimediaData = signal<MultimediaResponseDto[]>([]);
  private multimediaService = inject(MultimediaService);

  ngOnInit() {
    this.loadImages().then(() => console.log('loaded the gallery images'));
  }

  private async loadImages() {
    const data = await this.multimediaService.loadMultimediaData();
    this.multimediaData.set(data);
  }
}
