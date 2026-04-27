import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Configuration } from '../api';

/**
 * @deprecated
 * This pipe is deprecated and will be removed in a future version.
 * The backend now generates the signed URL, so this pipe is no longer needed.
 */
@Pipe({
  name: 'authenticatedMedia',
  standalone: true,
})
export class AuthenticatedMediaPipe implements PipeTransform {
  private httpClient = inject(HttpClient);
  private configuration = inject(Configuration);

  transform(url: string | null | undefined): Observable<string | null> {
    const basePath = this.configuration.basePath;

    if (!url) {
      return of(null);
    }

    return new Observable<string | null>((observer) => {
      let objectUrl: string | null = null;
      const subscription = this.httpClient.get(basePath + url, { responseType: 'blob' }).subscribe({
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
