import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../util/notification-service';

@Component({
  selector: 'app-authentication',
  imports: [TranslatePipe],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    const title = this.translateService.instant('authentication.logout');
    const text = this.translateService.instant('authentication.logout_confirm');
    const confirmButtonText = this.translateService.instant('common.yes');
    this.notificationService.showMessage(title, text, confirmButtonText, () =>
      this.authService.logout(),
    );
  }
}
