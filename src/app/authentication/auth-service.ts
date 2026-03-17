import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User, UserControllerService } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal(false);
  userData = signal<User>({});
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private userControllerService = inject(UserControllerService);

  constructor() {
    this.checkLocalStorage();
    this.getUserData();
  }

  login() {
    localStorage.setItem('isAuthenticated', 'true');
    this.isAuthenticated.set(true);
    this.navigateAfterSuccessfulLogin();
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getUserData() {
    this.userControllerService
      .findByEmail('test@test.com')
      .pipe(take(1))
      .subscribe((userData) => {
        console.log('User data received:');
        console.log(userData);
        this.userData.set(userData);
      });
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
  }
}
