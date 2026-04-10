import { Component, inject, input } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
import { MatDialog } from '@angular/material/dialog';
import { MultimediaContent } from '../multimedia-content/multimedia-content';
import { MultimediaStore } from '../multimedia-store';
import { AsyncPipe } from '@angular/common';
import { AuthenticatedMediaPipe } from '../authenticated-media.pipe';
import { NotificationService } from '../../util/notification-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-multimedia-thumbnail',
  imports: [AsyncPipe, AuthenticatedMediaPipe],
  templateUrl: './multimedia-thumbnail.html',
  styleUrl: './multimedia-thumbnail.css',
})
export class MultimediaThumbnail {
  multimedia = input.required<MultimediaResponseDto>();
  private multimediaStore = inject(MultimediaStore);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);

  private dialog = inject(MatDialog);

  protected openMultimedia() {
    this.dialog.open(MultimediaContent, {
      disableClose: true,
      data: this.multimedia(),
    });
  }

  protected deleteMultimedia() {
    const id = this.multimedia().id;
    if (!id) return;
    const title = this.translateService.instant('common.delete');
    const text = this.translateService.instant('multimedia.delete_confirm');
    const confirmButtonText = this.translateService.instant('common.yes');
    const callDelete = () => this.multimediaStore.deleteMultimedia(id);
    this.notificationService.showMessage(title, text, confirmButtonText, callDelete);
  }
}
