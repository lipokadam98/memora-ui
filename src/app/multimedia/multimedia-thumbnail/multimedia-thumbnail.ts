import { Component, input, output } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
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
  thumbnailClicked = output<MultimediaResponseDto>();
  selectionChecked = output<{ isChecked: boolean; id: number }>();

  protected onSelectionChange($event: MatCheckboxChange) {
    const id = this.multimedia().id;
    if (!id) return;
    const isChecked = $event.checked;
    this.selectionChecked.emit({ isChecked, id: id });
  }

  protected onThumbnailClicked() {
    this.thumbnailClicked.emit(this.multimedia());
  }
}
