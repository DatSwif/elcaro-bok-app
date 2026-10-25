import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { environment } from "../../environments/environment.prod";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (environment.skipAuth) {
    return true;
  }

  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return true;
  } else {
    return router.navigate(['/start']);
  }
};
