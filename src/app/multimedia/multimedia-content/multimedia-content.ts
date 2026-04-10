import { Component, inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MultimediaResponseDto } from '../../api';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthenticatedMediaPipe } from '../authenticated-media.pipe';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-multimedia-content',
  imports: [AsyncPipe, AuthenticatedMediaPipe, MatIcon, MatIconButton, MatDialogClose, DatePipe],
  templateUrl: './multimedia-content.html',
  styleUrl: './multimedia-content.css',
})
export class MultimediaContent {
  protected dialogData = inject(DIALOG_DATA) as MultimediaResponseDto;
}
