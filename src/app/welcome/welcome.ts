import { Component, inject } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-welcome',
  imports: [MatProgressSpinner],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  protected multimediaStore = inject(MultimediaStore);
}
