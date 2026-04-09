import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public showMessage(
    title: string,
    text: string,
    confirmButtonText: string,
    callback?: () => void,
  ) {
    Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
    }).then((result) => {
      if (result.isConfirmed && callback) callback();
    });
  }
}
