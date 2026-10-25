import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { SmsConfirmation } from '../../shared/sms-confirmation/sms-confirmation';

@Component({
  selector: 'app-auth-code',
  imports: [SmsConfirmation],
  templateUrl: './auth-code.html',
  styleUrl: './auth-code.css',
})
export class AuthCode implements OnInit {
  fromRegister! : boolean;

  clientNumber? : string;
  email? : string;
  phoneNumber! : string;
  acceptTerms? : boolean;
  acceptMarketingConsents : boolean = false;

  pageTitle!: string;
  buttonLabel!: string;

  constructor(private router : Router, private authService : AuthService) {
    const navigation = this.router.currentNavigation();
    this.fromRegister = navigation?.extras.state?.['fromRegister'];
    this.phoneNumber = navigation?.extras.state?.['phoneNumber'];

    if (!this.phoneNumber) {
      this.router.navigate(['/start']);
    }

    if (this.fromRegister) {
      this.clientNumber = navigation?.extras.state?.['clientNumber'];
      this.email = navigation?.extras.state?.['email'];
      this.acceptTerms = navigation?.extras.state?.['acceptTerms'];
      this.acceptMarketingConsents = navigation?.extras.state?.['acceptMarketingConsents'];
    }
  }

  ngOnInit() {
    this.pageTitle = this.fromRegister ? $localize`Rejestracja` : $localize`Logowanie`;
    this.buttonLabel = this.fromRegister ? $localize`Zarejestruj się` : $localize`Zaloguj się`;
  }
  
  handleVerify(code : string) {
    this.authService.postVerifyCode(this.phoneNumber, code).subscribe({
      next: (response : any) => {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate([this.fromRegister ? '/auth/register-success' : '/']);
      },
      error: (err : any) => {
        if (err.status === 429) {
          this.router.navigate(['/auth/limit-reached']);
        }
      }
    });
  }

  handleResend() {
    if (this.fromRegister) {
      this.authService.postRegister( 
        this.clientNumber ?? '',
        this.email ?? '',
        this.phoneNumber ?? '',
        this.acceptMarketingConsents
      );
    } else {
      this.authService.postLogin(
        this.phoneNumber ?? '',
      ).subscribe({
        next: () => {},
        error: (err : any) => {
          if (err.status === 429) {
            this.router.navigate(['/auth/limit-reached']);
          }
        }
      });
    }
  }
}
