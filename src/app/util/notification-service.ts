import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public showMessage(
    title: string,
    text: string,
    confirmButtonText: string,
    icon: SweetAlertIcon,
    showCancelButton: boolean,
    callback?: () => void,
  ) {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed && callback) callback();
    });
  }
}
