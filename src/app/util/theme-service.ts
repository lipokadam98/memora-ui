import { effect, Service, signal } from '@angular/core';

@Service()
export class ThemeService {
  public readonly darkMode = signal(false);

  constructor() {
    const saved = localStorage.getItem('darkMode');
    this.darkMode.set(saved === 'true');

    effect(() => {
      const enabled = this.darkMode();
      document.body.classList.toggle('dark-theme', enabled);
      localStorage.setItem('darkMode', enabled.toString());
    });
  }

  toggle() {
    this.darkMode.update((v) => !v);
  }
}
