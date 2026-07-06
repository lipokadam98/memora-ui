import { inject, Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly translateService = inject(TranslateService);

  /**
   * Shows a message using SweetAlert2. Provides translation support for the title, text, and confirm button text.
   * @param title - The title of the message.
   * @param text - The text of the message.
   * @param confirmButtonText - The text of the confirmation button.
   * @param icon - The icon to display.
   * @param showCancelButton - Whether to show the cancel button.
   * @param callback - The callback function to execute when the confirmation button is clicked.
   */
  public showMessage(
    title: string,
    text: string,
    confirmButtonText: string,
    icon: SweetAlertIcon,
    showCancelButton: boolean,
    callback?: () => void,
  ) {
    Swal.fire({
      title: this.translateService.instant(title),
      text: this.translateService.instant(text),
      confirmButtonText: this.translateService.instant(confirmButtonText),
      icon,
      showCancelButton,
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed && callback) callback();
    });
  }

  /**
   * Shows a snackbar message with translation support.
   * @param messageKey - The message to display.
   * @param duration - The duration of the snackbar in milliseconds. Defaults to 5000.
   */
  public async showSnackBar(messageKey: string, duration: number = 5000) {
    const translatedMessage = await firstValueFrom(this.translateService.get(messageKey));
    this.matSnackBar.open(translatedMessage, 'OK', { duration });
  }
}
