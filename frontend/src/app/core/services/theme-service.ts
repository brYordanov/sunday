import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

const themeType1: ThemeGroup = {
  ['theme-1-light']: 'theme-1-light',
  ['theme-1-dark']: 'theme-1-dark',
};
const themeType2: ThemeGroup = {
  ['theme-2-light']: 'theme-2-light',
  ['theme-2-dark']: 'theme-2-dark',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private htmlBody: HTMLElement | null = null;
  theme$: BehaviorSubject<Theme> = new BehaviorSubject(themeType1['theme-1-light']);
  constructor(
    private router: Router,
    private cookieService: CookieService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.htmlBody = this.document.body;
      this.listenForRouteChanges();
    }
  }

  toggleTheme(): void {
    if (!this.htmlBody) return;
    const rawBodyClass = this.htmlBody.className;
    const nextTheme = this.getNextTheme(rawBodyClass);

    this.setTheme(nextTheme);
  }

  getNextTheme(rawClass: string): Theme {
    const currentTheme: Theme = this.isValidTheme(rawClass) ? rawClass : 'theme-1-light';

    if (currentTheme in themeType1) {
      const nextTheme = currentTheme === 'theme-1-light' ? 'theme-1-dark' : 'theme-1-light';
      return nextTheme;
    }

    if (currentTheme in themeType2) {
      const nextTheme = currentTheme === 'theme-2-light' ? 'theme-2-dark' : 'theme-2-light';
      return nextTheme;
    }

    throw Error('something went wront');
  }

  setTheme(theme: Theme) {
    if (!this.htmlBody) return;

    this.theme$.next(theme);
    document.body.className = theme;
    const themeType = theme.split('-')[2];

    this.cookieService.set('theme', themeType, 365, '/');
  }

  private isValidTheme(value: string): value is Theme {
    return ['theme-1-light', 'theme-1-dark', 'theme-2-light', 'theme-2-dark'].includes(value);
  }

  private listenForRouteChanges() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        tap((e) => {
          this.applyThemeForRoute(e.urlAfterRedirects);
        }),
      )
      .subscribe();
  }

  private applyThemeForRoute(url: string) {
    const previouslySetTheme = this.cookieService.get('theme');
    let themeClass;
    if (url.startsWith('/crypto')) {
      themeClass =
        previouslySetTheme === 'dark' ? themeType2['theme-2-dark'] : themeType2['theme-2-light'];
    } else {
      themeClass =
        previouslySetTheme === 'dark' ? themeType1['theme-1-dark'] : themeType1['theme-1-light'];
    }

    this.setTheme(themeClass);
  }
}

type Theme = 'theme-1-light' | 'theme-1-dark' | 'theme-2-light' | 'theme-2-dark';
type ThemeGroup = Record<string, Theme>;
