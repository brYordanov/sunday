import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly htmlBody = document.body;
  constructor(private router: Router) {
    this.listenForRouteChanges();
  }

  private readonly themeType1 = {
    ['theme-1-light']: 'theme-1-light',
    ['theme-1-dark']: 'theme-1-dark',
  };

  private readonly themeType2 = {
    ['theme-2-light']: 'theme-2-light',
    ['theme-2-dark']: 'theme-2-dark',
  };

  toggleTheme(): void {
    const rawBodyClass = this.htmlBody.className;
    const nextTheme = this.getNextTheme(rawBodyClass);

    this.htmlBody.className = nextTheme;
  }

  getNextTheme(rawClass: string): string {
    const currentTheme: Theme = this.isValidTheme(rawClass) ? rawClass : 'theme-1-light';

    if (currentTheme in this.themeType1) {
      const nextTheme = currentTheme === 'theme-1-light' ? 'theme-1-dark' : 'theme-1-light';
      return nextTheme;
    }

    if (currentTheme in this.themeType2) {
      const nextTheme = currentTheme === 'theme-2-light' ? 'theme-2-dark' : 'theme-2-light';
      return nextTheme;
    }

    throw Error('something went wront');
  }

  setTheme(theme: Theme) {
    document.body.className = theme;
    const themeType = theme.split('-')[2];

    document.cookie = `theme=${themeType}; path=/; max-age=31536000`;
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
    if (url.startsWith('/crypto')) {
      this.setTheme('theme-2-light');
    } else {
      this.setTheme('theme-1-light');
    }
  }
}

type Theme = 'theme-1-light' | 'theme-1-dark' | 'theme-2-light' | 'theme-2-dark';
