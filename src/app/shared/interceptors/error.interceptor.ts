import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ErrorService } from "../error-service";
import { Router } from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let title = $localize`:@@errors.error:Błąd`;
      let message = $localize`:@@errors.unexpected:Wystąpił nieoczekiwany błąd serwera.`;

      if (error.status === 0) {
        // Network-level failures (Backend never received the request)
        title = $localize`:@@errors.connection:Błąd połączenia`;
        message = $localize`:@@errors.unreachable:Serwer jest nieosiągalny. Sprawdź połączenie z internetem.`;
      } else {
        switch (error.status) {
          case 400:
            title = $localize`:@@errors.badRequest:Błąd żądania`;
            message = $localize`:@@errors.badRequestDesc:Sprawdź, czy wszystkie pola zostały wypełnione poprawnie.`;
            break;
          case 401:
            localStorage.removeItem('auth_token');
            router.navigate(['/start']);
            title = $localize`:@@errors.unauthorized:Brak autoryzacji`;
            message = $localize`:@@errors.unauthorizedDesc:Zaloguj się ponownie, aby kontynuować.`;
            break;
          case 403:
            title = $localize`:@@errors.forbidden:Dostęp zabroniony`;
            message = $localize`:@@errors.forbiddenDesc:Nie masz dostępu do tego zasobu.`;
            break;
          case 404:
            title = $localize`:@@errors.notFound:Nie znaleziono`;
            message = $localize`:@@errors.notFoundDesc:Żądany zasób nie został znaleziony.`;
            break;
          case 422:
            title = $localize`:@@errors.validation:Nieprawidłowy kod`;
            message = $localize`:@@errors.validationDesc:Sprawdź poprawność wprowadzonego kodu.`;
            break;
          case 429:
            title = $localize`:@@errors.AuthError:Błąd autoryzacji`;
            message = $localize`@@errors.AuthErrorDesc:Sesja wygasła. Prosimy zalogować się ponownie.`;
            break;
          case 500:
            title = $localize`:@@errors.serverError:Błąd serwera`;
            message = $localize`:@@errors.serverErrorDesc:Wewnętrzny błąd serwera. Spróbuj ponownie później.`;
            break;
          default:
            title = error.error?.error || $localize`:@@errors.status:Błąd ${error.status}`;
            message = $localize`:@@errors.unexpected:Wystąpił nieoczekiwany błąd serwera.`;
            break;
        }
      }

      errorService.showError(title, message, 'error');

      return throwError(() => error);
    })
  );
};