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

  login() {
    const loginUserDto: LoginUserDto = {
      email: 'test@test.com',
      password: '123456',
    };
    this.authenticationControllerService
      .authenticate(loginUserDto)
      .pipe(take(1))
      .subscribe((loginResponse) => {
        this.loginData.set(loginResponse);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginData', JSON.stringify(loginResponse));
        this.isAuthenticated.set(true);
        this.navigateAfterSuccessfulLogin();
      });
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
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
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    this.isAuthenticated.set(isAuthenticated === 'true');
    const loginData = localStorage.getItem('loginData');
    if (loginData) {
      this.loginData.set(JSON.parse(loginData));
    }
  }
}
