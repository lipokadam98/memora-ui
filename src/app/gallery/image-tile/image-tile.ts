import { Component, input } from '@angular/core';
import { Image } from '../../multimedia-service';

@Component({
  selector: 'app-image-tile',
  imports: [],
  templateUrl: './image-tile.html',
  styleUrl: './image-tile.css',
})
export class ImageTile {
  image = input.required<Image>();
}
