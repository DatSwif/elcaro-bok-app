import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  // Endpoints that don't need a token
  const whiteList = [
    '/api/login',
    '/api/register',
    '/api/verify-code',
    '/api/doc'
  ];
  const isWhiteListed = whiteList.some(path => req.url.includes(path));

  // If token exists and the request isn't whitelisted, modify it
  if (token && !isWhiteListed) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  else {
    return next(req);
  }
};