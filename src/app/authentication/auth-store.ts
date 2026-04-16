import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginResponse, LoginUserDto, RegisterUserDto } from '../api';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { getErrorMessage } from '../util/util';

type AuthState = {
  loginData: LoginResponse | undefined;
  error: string | null;
  isLoading: boolean;
};

const initialState: AuthState = {
  loginData: undefined,
  error: null,
  isLoading: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      activatedRoute = inject(ActivatedRoute),
      router = inject(Router),
    ) => {
      async function login(loginUserDto: LoginUserDto) {
        patchState(store, { isLoading: true, error: null });
        try {
          const loginResponse = await authService.login(loginUserDto);
          patchState(store, { loginData: loginResponse });
          localStorage.setItem('loginData', JSON.stringify(loginResponse));
          const paramMap = await firstValueFrom(activatedRoute.queryParamMap);
          const returnUrl = paramMap.get('returnUrl');
          if (returnUrl) {
            await router.navigate([returnUrl]);
          } else {
            await router.navigate(['/']);
          }
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function logout() {
        localStorage.removeItem('loginData');
        patchState(store, { loginData: undefined });
        await router.navigate(['/']);
      }

      async function register(registerUserDto: RegisterUserDto) {
        patchState(store, { isLoading: true, error: null });
        try {
          //TODO implement registration
          const user = await authService.register(registerUserDto);
        } catch (error: unknown) {
          patchState(store, { error: getErrorMessage(error) });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function checkLocalStorage() {
        const loginData = localStorage.getItem('loginData');
        if (loginData) {
          const parsedData = JSON.parse(loginData) as LoginResponse;
          if (parsedData && parsedData.token && parsedData.expiresAt) {
            const expirationDate = new Date(parsedData.expiresAt);
            const now = new Date();
            if (expirationDate > now) {
              patchState(store, { loginData: parsedData });
              return;
            }
          }
        }
        await logout();
      }

      function clearError() {
        patchState(store, { error: null });
      }

      return { login, logout, register, checkLocalStorage, clearError };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.checkLocalStorage();
    },
  })),
);
