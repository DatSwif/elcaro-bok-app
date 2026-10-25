import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageUtilsService {
  private readonly STORAGE_KEY = 'app_language';
  private readonly DEFAULT_LANG = 'pl';

  public readonly SUPPORTED_LANGS = ['pl', 'en'];

  // Get the current language
  getLanguage(): string {
    return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
  }

  // Save the language to local storage
  setLanguage(lang: string | undefined | null): void {
    const validLang = lang ?? this.DEFAULT_LANG;
    localStorage.setItem(this.STORAGE_KEY, validLang);
  }

  // Handle the hard redirect when a user changes their settings
  processLanguageChange(newLang: string | undefined | null): void {
    const safeLang = newLang ?? this.DEFAULT_LANG;
    this.setLanguage(safeLang);

    const pathSegments = location.pathname.split('/');
    const potentialLangInUrl = pathSegments[1];

    // Apply change only if build is localized
    if (!this.SUPPORTED_LANGS.includes(potentialLangInUrl)) {
      return; 
    }

    if (safeLang !== potentialLangInUrl) {
      const newUrl = location.pathname.replace(`/${potentialLangInUrl}/`, `/${safeLang}/`);
      window.location.href = newUrl;
    }
  }

  syncWithLayoutApi(backendLang: string): void {
    const pathSegments = location.pathname.split('/');
    const urlLang = pathSegments[1];

    if (this.SUPPORTED_LANGS.includes(urlLang)) {
      this.setLanguage(urlLang);
    } 
    else {
      this.setLanguage(backendLang);
    }
  }
}
