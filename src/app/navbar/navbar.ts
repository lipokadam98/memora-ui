import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../util/theme-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthStore } from '../authentication/auth-store';
import { NotificationService } from '../util/notification-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, TranslatePipe, MatIcon, MatIconButton, MatButton],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected authStore = inject(AuthStore);
  private themeService = inject(ThemeService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  protected toggleDarkMode() {
    this.themeService.toggle();
  }

  protected logout() {
    const title = this.translateService.instant('authentication.logout');
    const text = this.translateService.instant('authentication.logout_confirm');
    const confirmButtonText = this.translateService.instant('common.yes');
    this.notificationService.showMessage(title, text, confirmButtonText, 'question', true, () =>
      this.authStore.logout(),
    );
  }
}
