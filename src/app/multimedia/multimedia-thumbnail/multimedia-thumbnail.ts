import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
import { MatDialog } from '@angular/material/dialog';
import { MultimediaContent } from '../multimedia-content/multimedia-content';
import { MultimediaStore } from '../multimedia-store';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-multimedia-thumbnail',
  templateUrl: './multimedia-thumbnail.html',
  styleUrl: './multimedia-thumbnail.css',
  imports: [MatCheckbox],
})
export class MultimediaThumbnail {
  isEditMode = input(false);
  multimedia = input.required<MultimediaResponseDto>();
  protected multimediaStore = inject(MultimediaStore);
  private viewContainerRef = inject(ViewContainerRef);

  private dialog = inject(MatDialog);

  protected openMultimedia() {
    this.multimediaStore.select(this.multimedia());
    this.dialog.open(MultimediaContent, {
      disableClose: true,
      viewContainerRef: this.viewContainerRef,
    });
  }

  protected onSelectionChange($event: MatCheckboxChange) {
    const id = this.multimedia().id;
    if (!id) return;
    const isChecked = $event.checked;
    if (isChecked) {
      this.multimediaStore.storeSelection(id);
    } else {
      this.multimediaStore.removeSelection(id);
    }
  }
}
