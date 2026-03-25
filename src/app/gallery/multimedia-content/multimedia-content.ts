import { Component, input } from '@angular/core';
import { MultimediaResponseDto } from '../../api';

@Component({
  selector: 'app-multimedia-content',
  imports: [],
  templateUrl: './multimedia-content.html',
  styleUrl: './multimedia-content.css',
})
export class MultimediaContent {
  multimedia = input.required<MultimediaResponseDto>();
}
