import { Routes } from '@angular/router';
import { Welcome } from './welcome/welcome';
import { Gallery } from './gallery/gallery';

export const routes: Routes = [
  { path: '', component: Welcome },
  { path: 'gallery', component: Gallery },
];
