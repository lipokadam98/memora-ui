import { Component, inject, OnInit } from '@angular/core';
import { MultimediaThumbnail } from './multimedia-thumbnail/multimedia-thumbnail';
import { Upload } from './upload/upload';
import { MultimediaStore } from './multimedia-store';

@Component({
  selector: 'app-gallery',
  imports: [MultimediaThumbnail, Upload],
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
