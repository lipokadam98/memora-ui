import { Component, inject, OnInit } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { MultimediaResponseDto } from '../../api';
import { AsyncPipe } from '@angular/common';
import { AuthenticatedMediaPipe } from '../authenticated-media.pipe';

@Component({
  selector: 'app-multimedia-content',
  imports: [AsyncPipe, AuthenticatedMediaPipe],
  templateUrl: './multimedia-content.html',
  styleUrl: './multimedia-content.css',
})
export class MultimediaContent implements OnInit {
  protected dialogData = inject(DIALOG_DATA) as MultimediaResponseDto;

  ngOnInit(): void {}
}
