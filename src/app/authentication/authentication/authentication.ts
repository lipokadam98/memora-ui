import { Component, effect, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthStore } from '../auth-store';
import { NotificationService } from '../../util/notification-service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-authentication',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatProgressBar,
  ],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  protected authenticationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(254)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  protected authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);

  constructor() {
    effect(() => {
      if (this.authStore.error()) {
        this.notificationService.showMessage(
          'authentication.login',
          'authentication.login_error',
          'common.ok',
          'error',
          false,
          () => this.authStore.clearError(),
        );
      }
    });
  }

  onLogin() {
    const { email, password } = this.authenticationForm.value;
    if (!email || !password) {
      return;
    }
    this.authStore.login({ email, password });
  }
}
