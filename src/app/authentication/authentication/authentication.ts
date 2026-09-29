import { Component, effect, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { AuthStore } from '../auth-store';
import { NotificationService } from '../../util/notification-service';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  email,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
} from '@angular/forms/signals';
import { Logger } from '../../util/logger';

interface LoginData {
  email: string;
  password: string;
}

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
    FormField,
    FormRoot,
  ],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  protected authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);
  private logger = inject(Logger);

  //https://angular.dev/essentials/signal-forms
  private loginModel = signal<LoginData>({
    email: '',
    password: '',
  });
  protected loginForm = form(
    this.loginModel,
    (schemaPath) => {
      required(schemaPath.email, { message: 'authentication.email_required' });
      email(schemaPath.email, { message: 'authentication.email_invalid' });
      minLength(schemaPath.password, 6, { message: 'authentication.password_invalid' });
      maxLength(schemaPath.email, 254, { message: 'authentication.email_invalid' });
      required(schemaPath.password, { message: 'authentication.password_required' });
    },
    {
      submission: {
        action: async (field) => {
          const { email, password } = field().value();

          if (!email || !password) {
            return;
          }

          await this.authStore.login({
            email,
            password,
          });
        },
      },
    },
  );

  constructor() {
    effect(() => {
      if (this.authStore.error()) {
        this.logger.error('Error during login');
        this.loginForm().reset();
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
}
