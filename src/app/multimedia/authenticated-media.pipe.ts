import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'authenticatedMedia',
  standalone: true,
})
export class AuthenticatedMediaPipe implements PipeTransform {
  private httpClient = inject(HttpClient);

  transform(url: string | null | undefined): Observable<string | null> {
    if (!url) {
      return of(null);
    }

    return new Observable<string | null>((observer) => {
      let objectUrl: string | null = null;
      const subscription = this.httpClient.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          objectUrl = URL.createObjectURL(blob);
          observer.next(objectUrl);
        },
        error: () => observer.next(null),
      });

      return () => {
        subscription.unsubscribe();
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    });
  }
}
