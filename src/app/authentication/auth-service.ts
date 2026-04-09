import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthenticationControllerService, LoginResponse, LoginUserDto } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal(false);
  loginData = signal<LoginResponse | undefined>(undefined);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authenticationControllerService = inject(AuthenticationControllerService);

  constructor() {
    this.checkLocalStorage();
  }

  login(loginUserDto: LoginUserDto) {
    this.authenticationControllerService
      .authenticate(loginUserDto)
      .pipe(take(1))
      .subscribe((loginResponse) => {
        this.loginData.set(loginResponse);
        localStorage.setItem('loginData', JSON.stringify(loginResponse));
        this.isAuthenticated.set(true);
        this.navigateAfterSuccessfulLogin();
      });
  }

  logout() {
    localStorage.removeItem('loginData');
    this.isAuthenticated.set(false);
    this.loginData.set(undefined);
    this.router.navigate(['/']);
  }

  private navigateAfterSuccessfulLogin() {
    this.activatedRoute.queryParamMap.pipe(take(1)).subscribe((params) => {
      const returnUrl = params.get('returnUrl');
      console.log('Return URL:', returnUrl);
      if (returnUrl) {
        this.router.navigate([returnUrl]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private checkLocalStorage() {
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      const parsedData = JSON.parse(loginData) as LoginResponse;
      if (parsedData && parsedData.token && parsedData.expiresAt) {
        const expirationDate = new Date(parsedData.expiresAt);
        const now = new Date();
        if (expirationDate > now) {
          this.loginData.set(parsedData);
          this.isAuthenticated.set(true);
          return;
        }
      }
    }
    this.logout();
  }

  private setLogoutTimer() {}
}
