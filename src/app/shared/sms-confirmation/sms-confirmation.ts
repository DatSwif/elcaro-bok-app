import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputOtpModule } from 'primeng/inputotp';

@Component({
  selector: 'app-sms-confirmation',
  standalone: true,
  imports: [InputOtpModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sms-confirmation.html',
  styleUrl: './sms-confirmation.css',
})
export class SmsConfirmation {
  // Configurable text inputs
  @Input() title: string = '';
  @Input() description: string = $localize`Na podany numer telefonu<br>wysłaliśmy jednorazowy kod.`;
  @Input() submitLabel: string = $localize`Potwierdź`;
  
  // Optional loading state to disable buttons during API calls
  @Input() isLoading: boolean = false; 

  // Emits the code to the parent when valid
  @Output() verify = new EventEmitter<string>();
  
  // Emits an event to the parent when "Resend" is clicked
  @Output() resend = new EventEmitter<void>();

  codeForm = new FormGroup({
    otp: new FormControl('', [Validators.required])
  });

  verifyCode() {
    if (this.codeForm.valid) {
      const code = this.codeForm.value.otp;
      this.verify.emit(code ? code : '');
    } else {
      this.codeForm.markAllAsTouched();
    }
  }

  resendCode() {
    this.resend.emit();
    this.codeForm.reset();
  }
}