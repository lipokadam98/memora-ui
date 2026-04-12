import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthenticatedMediaPipe } from '../authenticated-media.pipe';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogClose } from '@angular/material/dialog';
import { MultimediaStore } from '../multimedia-store';

@Component({
  selector: 'app-multimedia-content',
  imports: [AsyncPipe, AuthenticatedMediaPipe, MatIcon, MatIconButton, MatDialogClose, DatePipe],
  templateUrl: './multimedia-content.html',
  styleUrl: './multimedia-content.css',
})
export class MultimediaContent {
  protected multimediaStore = inject(MultimediaStore);
}
