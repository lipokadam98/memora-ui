import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { AuthStore } from './authentication/auth-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private authStore = inject(AuthStore);

  constructor() {
    this.authStore.checkLocalStorage();
  }
}
