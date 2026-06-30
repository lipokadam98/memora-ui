import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
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
export class Gallery implements OnDestroy {
  isTopButtonVisible = signal(true);
  protected multimediaStore = inject(MultimediaStore);
  protected isEditMode = signal(false);
  private dialog = inject(MatDialog);
  private viewContainerRef = inject(ViewContainerRef);
  private notificationService = inject(NotificationService);
  private observer!: IntersectionObserver;

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

  @ViewChild('topButton', { read: ElementRef }) set topButtonRef(element: ElementRef | undefined) {
    if (element && element.nativeElement) {
      this.initObserver(element.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  private initObserver(element: HTMLElement) {
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.isTopButtonVisible.set(entry.isIntersecting);
      },
      {
        threshold: 0.75,
      },
    );

    this.observer.observe(element);
  }
}
