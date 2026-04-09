import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../util/notification-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-authentication',
  imports: [TranslatePipe, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  authenticationForm = new FormGroup({
    email: new FormControl('test@test.com'),
    password: new FormControl('123456'),
  });
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);

  onLogin() {
    const email = this.authenticationForm.get('email')?.value;
    const password = this.authenticationForm.get('password')?.value;
    if (!email || !password)
      return alert(this.translateService.instant('authentication.login_error'));
    this.authService.login({ email, password });
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
