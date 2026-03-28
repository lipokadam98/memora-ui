import { Component, inject, input } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
import { MatDialog } from '@angular/material/dialog';
import { MultimediaContent } from '../multimedia-content/multimedia-content';
import { MultimediaStore } from '../multimedia-store';

@Component({
  selector: 'app-multimedia-tile',
  imports: [],
  templateUrl: './multimedia-tile.html',
  styleUrl: './multimedia-tile.css',
})
export class MultimediaTile {
  multimedia = input.required<MultimediaResponseDto>();
  private multimediaStore = inject(MultimediaStore);

  private dialog = inject(MatDialog);

  protected openMultimedia() {
    this.dialog.open(MultimediaContent, {
      data: this.multimedia(),
    });
  }

  protected deleteMultimedia() {
    if (!confirm('Are you sure you want to delete this multimedia?')) return;
    const id = this.multimedia().id;
    if (id) {
      this.multimediaStore.deleteMultimedia(id);
    }
  }
}
