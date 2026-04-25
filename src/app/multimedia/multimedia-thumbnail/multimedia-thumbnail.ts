import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
import { MatDialog } from '@angular/material/dialog';
import { MultimediaContent } from '../multimedia-content/multimedia-content';
import { MultimediaStore } from '../multimedia-store';
import { NotificationService } from '../../util/notification-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multimedia-thumbnail',
  templateUrl: './multimedia-thumbnail.html',
  styleUrl: './multimedia-thumbnail.css',
})
export class MultimediaThumbnail {
  multimedia = input.required<MultimediaResponseDto>();
  private multimediaStore = inject(MultimediaStore);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private viewContainerRef = inject(ViewContainerRef);

  private dialog = inject(MatDialog);

  protected openMultimedia() {
    this.multimediaStore.select(this.multimedia());
    this.dialog.open(MultimediaContent, {
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
    });
  }

  protected deleteMultimedia() {
    const id = this.multimedia().id;
    if (!id) return;
    const title = this.translateService.instant('common.delete');
    const text = this.translateService.instant('multimedia.delete_confirm');
    const confirmButtonText = this.translateService.instant('common.yes');
    const removeFn = () => this.multimediaStore.remove(id);
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
