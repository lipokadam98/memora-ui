import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginResponse, LoginUserDto, RegisterUserDto } from '../api';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { getErrorMessage } from '../util/util';
import { Logger } from '../util/logger';

type AuthState = {
  loginData: LoginResponse | undefined;
  error: string | null;
  isLoading: boolean;
  countdown: number | null;
};

const initialState: AuthState = {
  loginData: undefined,
  error: null,
  isLoading: false,
  countdown: null,
};

let timerIntervalId: any = null;

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      activatedRoute = inject(ActivatedRoute),
      router = inject(Router),
      logger = inject(Logger),
    ) => {
      function stopTimer() {
        if (timerIntervalId) {
          clearInterval(timerIntervalId);
          timerIntervalId = null;
        }
        patchState(store, { countdown: null });
      }

      function startTimer(expiresAtString: string) {
        stopTimer();

        const expiresAt = new Date(expiresAtString).getTime();

        const updateCountdown = async () => {
          const now = Date.now();
          const timeLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));

          patchState(store, { countdown: timeLeft });

          //TODO Add refreshToken functionality
          if (timeLeft <= 0) {
            stopTimer();
            await logout();
          }
        };

        updateCountdown();
        timerIntervalId = setInterval(updateCountdown, 1000);
      }

      async function login(loginUserDto: LoginUserDto) {
        patchState(store, { isLoading: true, error: null });
        try {
          const loginResponse = await authService.login(loginUserDto);
          patchState(store, { loginData: loginResponse });
          localStorage.setItem('loginData', JSON.stringify(loginResponse));

          if (loginResponse.expiresAt) {
            startTimer(loginResponse.expiresAt);
          }

          const paramMap = await firstValueFrom(activatedRoute.queryParamMap);
          const returnUrl = paramMap.get('returnUrl');
          if (returnUrl) {
            await router.navigate([returnUrl]);
          } else {
            await router.navigate(['/']);
          }
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during login: ${error}`);
          patchState(store, { error });
        } finally {
          patchState(store, { isLoading: false });
        }
      }

      async function logout() {
        stopTimer();
        localStorage.removeItem('loginData');
        patchState(store, { loginData: undefined });
        await router.navigate(['/authentication']);
      }

      async function register(registerUserDto: RegisterUserDto) {
        patchState(store, { isLoading: true, error: null });
        try {
          //TODO implement registration
          const user = await authService.register(registerUserDto);
        } catch (err: unknown) {
          const error = getErrorMessage(err);
          logger.error(`Error during registration: ${error}`);
          patchState(store, { error });
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
              startTimer(parsedData.expiresAt);
              return;
            }
          }
        }
        await logout();
      }

      function clearError() {
        patchState(store, { error: null });
      }

      return { login, logout, register, checkLocalStorage, clearError, stopTimer };
    },
  ),
  withHooks((store) => ({
    onInit() {
      store.checkLocalStorage();
    },
    onDestroy() {
      store.stopTimer();
    },
  })),
);
