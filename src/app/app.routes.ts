import {Routes} from '@angular/router';
import {Welcome} from './components/welcome/welcome';
import {Gallery} from './components/gallery/gallery';

export const routes: Routes = [
  {path: '', component: Welcome},
  {path: 'gallery', component: Gallery},
];
