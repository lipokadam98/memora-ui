import { Component, inject } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  protected multimediaStore = inject(MultimediaStore);
}
