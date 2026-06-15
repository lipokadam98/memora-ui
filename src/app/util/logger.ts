import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable({ providedIn: 'root' })
export class Logger {
  private readonly isEnabled = signal(environment.enableLogging).asReadonly();
  private readonly logLevel = signal(environment.logLevel).asReadonly();

  debug(message: string) {
    this.log(LogLevel.DEBUG, message);
  }

  info(message: string) {
    this.log(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message);
  }

  error(message: string) {
    console.error(message);
  }

  private log(level: LogLevel, message: any) {
    if (!this.isEnabled() || level < this.logLevel()) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${LogLevel[level]}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.log(prefix, message);
        break;
      case LogLevel.INFO:
        console.info(prefix, message);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message);
        break;
    }
  }
}
