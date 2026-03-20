import { Component, input } from '@angular/core';
import { Multimedia, MultimediaResponseDto } from '../../api';

@Component({
  selector: 'app-image-tile',
  imports: [],
  templateUrl: './multimedia-tile.html',
  styleUrl: './multimedia-tile.css',
})
export class MultimediaTile {
  multimedia = input.required<MultimediaResponseDto>();
}
