import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from './auth-store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.loginData()) {
    return true;
  }

  // Redirect to login, saving the attempted URL
  return router.createUrlTree(['/authentication'], { queryParams: { returnUrl: state.url } });
};
