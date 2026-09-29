import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value == null || isNaN(value)) return '00:00';

    const totalSeconds = Math.max(0, Math.floor(value));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, '0');

    return `${pad(minutes)}:${pad(seconds)}`;
  }
}
