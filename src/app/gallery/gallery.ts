import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Upload } from '../multimedia/upload/upload';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MultimediaThumbnail } from '../multimedia/multimedia-thumbnail/multimedia-thumbnail';

@Component({
  selector: 'app-gallery',
  imports: [TranslatePipe, MatIcon, MatButton, MatProgressSpinner, MultimediaThumbnail],
  providers: [MultimediaStore],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {
  protected multimediaStore = inject(MultimediaStore);
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);

  ngOnInit() {
    this.multimediaStore.loadAll();
  }

  protected openUploadDialog() {
    this.dialog.open(Upload, {
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
    });
  }
}
