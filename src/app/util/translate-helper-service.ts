import { inject, Injectable } from '@angular/core';
import { map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateHelperService {
  private translateService = inject(TranslateService);

  currentLang = toSignal(
    this.translateService.onLangChange.pipe(
      map((event) => event.lang),
      startWith(this.translateService.getCurrentLang()),
    ),
  );

  changeLanguage(lang: 'en' | 'hu') {
    this.translateService.use(lang);
  }
}
