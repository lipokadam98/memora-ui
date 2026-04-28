import { Component, effect, inject, signal, ViewContainerRef } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Upload } from '../multimedia/upload/upload';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MultimediaThumbnail } from '../multimedia/multimedia-thumbnail/multimedia-thumbnail';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../util/notification-service';

//TODO Add date to and from search to the gallery
@Component({
  selector: 'app-gallery',
  imports: [
    TranslatePipe,
    MatButton,
    MatProgressSpinner,
    MultimediaThumbnail,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  protected isEditMode = signal(false);
  protected multimediaStore = inject(MultimediaStore);
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);
  private _snackBar = inject(MatSnackBar);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.multimediaStore.error()) {
        const message = this.translateService.instant('gallery.load_error');
        this._snackBar.open(message, 'OK', { duration: 5000 });
        this.multimediaStore.clearError();
      }
    });
  }

  protected openUploadDialog() {
    this.dialog.open(Upload, {
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
    });
  }

  protected toggleEditMode() {
    this.isEditMode.update((v) => !v);
  }

  protected deleteMultimedia() {
    const title = this.translateService.instant('common.delete');
    const text = this.translateService.instant('gallery.delete_batch_confirm');
    const confirmButtonText = this.translateService.instant('common.yes');
    const removeFn = () => this.multimediaStore.deleteSelectedItems();
    this.notificationService.showMessage(
      title,
      text,
      confirmButtonText,
      'question',
      true,
      removeFn,
    );
  }
}
