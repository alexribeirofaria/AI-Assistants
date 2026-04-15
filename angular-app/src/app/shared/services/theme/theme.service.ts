import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'theme-mode';
  private _isDarkMode = signal<boolean>(false);

  readonly isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    this.loadTheme();
  }

  toggle(): void {
    const newValue = !this._isDarkMode();
    this._isDarkMode.set(newValue);
    this.applyTheme(newValue);
    this.saveTheme(newValue);
  }

  private loadTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const isDark = saved === 'dark';
    this._isDarkMode.set(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  private saveTheme(isDark: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');
  }
}
