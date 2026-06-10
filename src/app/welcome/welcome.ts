import { Component, inject } from '@angular/core';
import { MultimediaStore } from '../multimedia/multimedia-store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-welcome',
  imports: [MatProgressSpinner, TranslatePipe, MatButton, RouterLink, MatIcon],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
})
export class Welcome {
  protected multimediaStore = inject(MultimediaStore);
}
