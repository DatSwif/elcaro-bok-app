import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../auth-service';
import { PhoneInput } from '../../shared/phone-input/phone-input';
import { ErrorService } from '../../shared/error-service';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    InputMaskModule,
    SelectModule,
    FormsModule,
    PhoneInput
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {

  loginForm = new FormGroup({
    phoneNumber: new FormControl('+48', [Validators.required])
  });

  constructor(private router : Router, private authService : AuthService, private errorService : ErrorService) {}

  verifyForm() {
    if (this.loginForm.valid) {
      this.authService.postLogin(this.loginForm.value.phoneNumber ?? '').subscribe({
        next: () => {
          this.router.navigate(['/auth/auth-code'], { 
            state: { 
              fromRegister : false,
              phoneNumber: this.loginForm.value.phoneNumber } 
          });
        },
        error: (err : any) => {
          if (err.status === 429) {
            console.error('Account locked: Too many attempts');
            this.router.navigate(['/auth/limit-reached']);
          } else {
            console.error('An unexpected error occurred', err);
          }
        }
      });
    } else {
      this.errorService.showError('Form invalid', 'Fill out all the fields and consent to the terms of service to proceed');
    }
  }
}
