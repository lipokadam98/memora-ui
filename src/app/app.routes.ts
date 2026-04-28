import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Gallery } from './gallery/gallery';
import { Notes } from './notes/notes';
import { authGuard } from './authentication/auth-guard';
import { Authentication } from './authentication/authentication/authentication';

export const routes: Routes = [
  { path: '', component: Welcome, canActivate: [authGuard] },
  { path: 'gallery', component: Gallery, canActivate: [authGuard] },
  { path: 'notes', component: Notes, canActivate: [authGuard] },
  { path: 'authentication', component: Authentication },
];
