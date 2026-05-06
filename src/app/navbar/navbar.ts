import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../util/theme-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthStore } from '../authentication/auth-store';
import { NotificationService } from '../util/notification-service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateHelperService } from '../util/translate-helper-service';
import { MatDialog } from '@angular/material/dialog';
import { Settings } from '../settings/settings';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    TranslatePipe,
    MatIcon,
    MatIconButton,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected authStore = inject(AuthStore);
  protected themeService = inject(ThemeService);
  protected translateHelperService = inject(TranslateHelperService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private matDialog = inject(MatDialog);

  protected toggleDarkMode() {
    this.themeService.toggle();
  }

  protected openSettings() {
    this.matDialog.open(Settings);
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
