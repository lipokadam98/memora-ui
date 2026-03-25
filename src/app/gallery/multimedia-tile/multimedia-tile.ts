import { Component, inject, input } from '@angular/core';
import { MultimediaResponseDto } from '../../api';
import { MatDialog } from '@angular/material/dialog';
import { MultimediaContent } from '../multimedia-content/multimedia-content';

@Component({
  selector: 'app-multimedia-tile',
  imports: [],
  templateUrl: './multimedia-tile.html',
  styleUrl: './multimedia-tile.css',
})
export class MultimediaTile {
  multimedia = input.required<MultimediaResponseDto>();

  private dialog = inject(MatDialog);

  protected openMultimedia() {
    this.dialog.open(MultimediaContent, {
      data: this.multimedia(),
    });
  }
}
