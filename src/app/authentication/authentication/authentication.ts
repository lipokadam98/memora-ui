import { Component, inject } from '@angular/core';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-authentication',
  imports: [],
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
