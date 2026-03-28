import { Component, inject, OnInit } from '@angular/core';
import { MultimediaTile } from './multimedia-tile/multimedia-tile';
import { Upload } from './upload/upload';
import { MultimediaStore } from './multimedia-store';

@Component({
  selector: 'app-gallery',
  imports: [MultimediaTile, Upload],
  providers: [MultimediaStore],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected multimediaStore = inject(MultimediaStore);

  ngOnInit() {
    this.multimediaStore.loadAll();
  }
}
