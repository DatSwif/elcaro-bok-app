import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageUtilsService } from '../language-utils-service';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const langUtils = inject(LanguageUtilsService);
  const userLang = langUtils.getLanguage();
  
  // Language-related requests are exempt
  const isLanguageUpdateEndpoint = req.url.includes('/api/clients/lang-notification-settings') && req.method === 'POST';

  if (isLanguageUpdateEndpoint) {
    return next(req);
  }

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': userLang
    }
  });

  return next(modifiedReq);
};