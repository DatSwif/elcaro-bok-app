import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, throwError, Observable, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { DocumentItem } from '../shared/document-service/document-service';
import { DocumentService } from '../shared/document-service/document-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  apiUrls = {
    login: '/api/auth/login',
    verifyCode: '/api/auth/verify-code',
    register: '/api/auth/register',
    createAccount: '/api/clients',
    termsOfService: '/api/auth/terms-of-service',
    privacyPolicy: '/api/auth/privacy-policy',
    marketingConsents: '/api/auth/marketing-consents',
  }

  constructor(
    private http : HttpClient,
    private router : Router,
    private documentService: DocumentService
  ) {}

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  getStandardOptions() : any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('There is an issue with the client or network: ', error.error);
    } else {
      console.error('Server-side error: ', error.error);
    }

    return throwError(() => error);
  }
  
  hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn.next(false);
    this.router.navigate(['/start']);
  }

  login(token: string) {
    localStorage.setItem('auth_token', token);
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }

  postLogin(phoneNumber : string) : any {
    let options = this.getStandardOptions();
    options.params = new HttpParams({
      fromObject: {
        format: 'json'
      }
    });

    const payload = {
      phoneNumber: phoneNumber
    }

    return this.http.post(this.apiUrls.login, payload, options).pipe(catchError(this.handleError));
  }

  postRegister(clientNumber : string, email : string, phoneNumber : string, marketingConsent: boolean) : any {
    let options = this.getStandardOptions();
    options.params = new HttpParams({
      fromObject: {
        format: 'json'
      }
    });

    const payload = {
      clientNumber: clientNumber,
      email: email,
      phoneNumber: phoneNumber,
      marketingConsent: marketingConsent
    }

    return this.http.post(this.apiUrls.register, payload, options).pipe(catchError(this.handleError));
  }

  postVerifyCode(phoneNumber : string, code: string) : any {
    let options = this.getStandardOptions();
    options.params = new HttpParams({
      fromObject: {
        format: 'json'
      }
    });

    const payload = {
      phoneNumber: phoneNumber,
      code: code
    }

    return this.http.post(this.apiUrls.verifyCode, payload, options).pipe(catchError(this.handleError));
  }

  getTermsOfService(): Observable<DocumentItem> {
    return this.http.get<Pick<DocumentItem, 'id' | 'title'>>(
      this.apiUrls.termsOfService,
      this.getStandardOptions() as { headers: HttpHeaders }
    ).pipe(
      switchMap(document =>
        this.documentService.getDocumentContent(document.id).pipe(
          map(content => ({
            id: document.id,
            title: document.title,
            text: content.text,
            type: 'terms-of-service'
          }))
        )
      ),
      catchError(this.handleError)
    );
  }

  getPrivacyPolicy(): Observable<DocumentItem> {
    return this.http.get<Pick<DocumentItem, 'id' | 'title'>>(
      this.apiUrls.privacyPolicy,
      this.getStandardOptions() as { headers: HttpHeaders }
    ).pipe(
      switchMap(document =>
        this.documentService.getDocumentContent(document.id).pipe(
          map(content => ({
            id: document.id,
            title: document.title,
            text: content.text,
            type: 'privacy-policy'
          }))
        )
      ),
      catchError(this.handleError)
    );
  }

  getMarketingConsents(): Observable<DocumentItem> {
    return this.http.get<Pick<DocumentItem, 'id' | 'title'>>(
      this.apiUrls.marketingConsents,
      this.getStandardOptions() as { headers: HttpHeaders }
    ).pipe(
      switchMap(document =>
        this.documentService.getDocumentContent(document.id).pipe(
          map(content => ({
            id: document.id,
            title: document.title,
            text: content.text,
            type: 'marketing-consents'
          }))
        )
      ),
      catchError(this.handleError)
    );
  }
}