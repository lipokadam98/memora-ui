import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated = signal(false);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.checkLocalStorage();
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
