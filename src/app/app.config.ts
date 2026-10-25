import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { languageInterceptor } from './shared/interceptors/language.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false || 'none'
            }
        }
    }),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        languageInterceptor
      ])
    )
  ]
};
