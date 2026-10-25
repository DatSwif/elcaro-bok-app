import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageUtilsService } from './shared/language-utils-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('elcaro-bok-app');

  langUtils = inject(LanguageUtilsService);

  constructor(private router : Router) {
    const pathSegments = location.pathname.split('/');
    const urlLang = pathSegments[1];

    if (this.langUtils.SUPPORTED_LANGS.includes(urlLang)) {
      this.langUtils.setLanguage(urlLang);
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('auth_token');
    
  }
}
