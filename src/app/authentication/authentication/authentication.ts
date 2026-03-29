import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-authentication',
  imports: [TranslatePipe],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class Authentication {
  private authService = inject(AuthService);

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.logout();
  }
}
