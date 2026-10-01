import { Component, effect, inject, signal, ViewContainerRef } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Upload } from '../multimedia/upload/upload';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MultimediaThumbnail } from '../multimedia/multimedia-thumbnail/multimedia-thumbnail';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../util/notification-service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MultimediaResponseDto } from '../api';
import { MultimediaContent } from '../multimedia/multimedia-content/multimedia-content';

//TODO Add date to and from search to the gallery
@Component({
  selector: 'app-gallery',
  imports: [
    TranslatePipe,
    MatProgressSpinner,
    MultimediaThumbnail,
    MatIcon,
    MatIconButton,
    MatFabButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery {
  isTopButtonVisible = signal(true);
  protected multimediaStore = inject(MultimediaStore);
  protected isEditMode = signal(false);
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.multimediaStore.error() && this.multimediaStore.errorType()) {
        const errorType = this.multimediaStore.errorType();
        this.notificationService.showSnackBar(`gallery.error.${errorType}`);
        this.multimediaStore.clearError();
      }
    });
    effect(() => {
      if (!this.isEditMode()) {
        this.multimediaStore.clearSelections();
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
    const removeFn = () => this.multimediaStore.deleteSelectedItems();
    this.notificationService.showMessage(
      'common.delete',
      'gallery.delete_batch_confirm',
      'common.yes',
      'question',
      true,
      removeFn,
    );
  }

  protected onThumbnailClicked(multimedia: MultimediaResponseDto) {
    this.multimediaStore.select(multimedia);
    this.dialog.open(MultimediaContent, {
      viewContainerRef: this.viewContainerRef,
    });
  }

  protected onSelectionChecked($event: { isChecked: boolean; id: number }) {
    const { id } = $event;
    if ($event.isChecked) {
      this.multimediaStore.storeSelection(id);
    } else {
      this.multimediaStore.removeSelection(id);
    }
  }
}
