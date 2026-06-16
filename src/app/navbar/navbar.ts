import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../util/theme-service';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { AuthStore } from '../authentication/auth-store';
import { NotificationService } from '../util/notification-service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslateHelperService } from '../util/translate-helper-service';
import { MatDialog } from '@angular/material/dialog';
import { Settings } from '../settings/settings';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

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
    NgClass,
    MatTooltip,
    DecimalPipe,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected authStore = inject(AuthStore);
  protected themeService = inject(ThemeService);
  protected readonly Math = Math;
  private translateHelperService = inject(TranslateHelperService);
  private notificationService = inject(NotificationService);
  private matDialog = inject(MatDialog);

  protected toggleDarkMode() {
    this.themeService.toggle();
  }

  protected openSettings() {
    this.matDialog.open(Settings);
  }

  protected logout() {
    this.notificationService.showMessage(
      'authentication.logout',
      'authentication.logout_confirm',
      'common.yes',
      'question',
      true,
      () => this.authStore.logout(),
    );
  }

  protected changeLanguage(lang: 'en' | 'hu') {
    this.translateHelperService.changeLanguage(lang);
  }
}
