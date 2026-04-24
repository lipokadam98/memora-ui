import { Component, effect, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthStore } from '../auth-store';
import { NotificationService } from '../../util/notification-service';

@Component({
  selector: 'app-authentication',
  imports: [TranslatePipe, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  authenticationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  private authStore = inject(AuthStore);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.authStore.error()) {
        const title = this.translateService.instant('authentication.login');
        const text = this.translateService.instant('authentication.login_error');
        const confirmButtonText = this.translateService.instant('common.ok');
        this.notificationService.showMessage(title, text, confirmButtonText, 'error', false, () =>
          this.authStore.clearError(),
        );
      }
    });
  }

  onLogin() {
    const email = this.authenticationForm.get('email')?.value;
    const password = this.authenticationForm.get('password')?.value;
    if (!email || !password) {
      return;
    }
    this.authStore.login({ email, password });
  }
}
