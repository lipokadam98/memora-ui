import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthenticationControllerService, LoginUserDto, RegisterUserDto } from '../api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticationControllerService = inject(AuthenticationControllerService);

  async login(loginUserDto: LoginUserDto) {
    return await firstValueFrom(this.authenticationControllerService.authenticate(loginUserDto));
  }

  async register(registerUserDto: RegisterUserDto) {
    return await firstValueFrom(this.authenticationControllerService.register(registerUserDto));
  }
}
