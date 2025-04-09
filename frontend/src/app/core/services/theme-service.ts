import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly htmlBody = document.body;

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

  //   setTheme(theme: 'light' | 'dark'): void {
  //     const className = this.themes[theme];
  //     this.htmlElement.className = className;
  //     document.body.className = className;
  //   }

  //   getCurrentTheme(): 'light' | 'dark' {
  //     return this.htmlElement.className === this.themes.dark ? 'dark' : 'light';
  //   }

  private isValidTheme(value: string): value is Theme {
    return ['theme-1-light', 'theme-1-dark', 'theme-2-light', 'theme-2-dark'].includes(value);
  }
}

type Theme = 'theme-1-light' | 'theme-1-dark' | 'theme-2-light' | 'theme-2-dark';
