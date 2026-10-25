import { Component, signal, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from "@angular/router";
import { DocumentService, DocumentItem } from '../../shared/document-service/document-service';
import { DocumentViewer } from '../../shared/document-viewer/document-viewer';
import { InputMaskModule } from 'primeng/inputmask';
import { PhoneInput } from '../../shared/phone-input/phone-input';
import { AuthService } from '../auth-service';
import { ErrorService } from '../../shared/error-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-form',
  imports: [
    DocumentViewer,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    CheckboxModule,
    PhoneInput
  ],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css'],
})
export class RegisterForm {
  private router = inject(Router);
  private authService = inject(AuthService);
  private errorService = inject(ErrorService);
  public documentService = inject(DocumentService);
  private cdr = inject(ChangeDetectorRef);

  registerForm = new FormGroup({
    clientNumber: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('+48', Validators.required),
    acceptTerms: new FormControl(false, Validators.requiredTrue),
    acceptMarketingConsents: new FormControl(false),
  });

  termsOfService = signal<DocumentItem | null>(null);
  privacyPolicy = signal<DocumentItem | null>(null);
  marketingConsents = signal<DocumentItem | null>(null);
  
  isLoadingTerms = signal(false);
  isLoadingPrivacy = signal(false);
  isLoadingMarketingConsents = signal(false);

  async openTermsOfService() {
    if (this.termsOfService()) {
      this.documentService.showDocument(this.termsOfService()!);
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingTerms.set(true);
    this.cdr.detectChanges();
    
    try {
      const document = await firstValueFrom(this.authService.getTermsOfService());
      this.termsOfService.set(document);
      this.documentService.showDocument(document);
    } catch (err: any) {
      console.error('Error loading terms of service', err);
    } finally {
      this.isLoadingTerms.set(false);
      this.cdr.detectChanges();
    }
  }

  async openPrivacyPolicy() {
    if (this.privacyPolicy()) {
      this.documentService.showDocument(this.privacyPolicy()!);
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingPrivacy.set(true);
    this.cdr.detectChanges();

    try {
      const document = await firstValueFrom(this.authService.getPrivacyPolicy());
      this.privacyPolicy.set(document);
      this.documentService.showDocument(document);
    } catch (err: any) {
      console.error('Error loading privacy policy', err);
    } finally {
      this.isLoadingPrivacy.set(false);
      this.cdr.detectChanges();
    }
  }

  async openMarketingConsents() {
    if (this.marketingConsents()) {
      this.documentService.showDocument(this.marketingConsents()!);
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingMarketingConsents.set(true);
    this.cdr.detectChanges();

    try {
      const document = await firstValueFrom(this.authService.getMarketingConsents());
      this.marketingConsents.set(document);
      this.documentService.showDocument(document);
    } catch (err: any) {
      console.error('Error loading marketing consents', err);
    } finally {
      this.isLoadingMarketingConsents.set(false);
      this.cdr.detectChanges();
    }
  }

  verifyForm() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value.phoneNumber);
      this.authService.postRegister(
        this.registerForm.value.clientNumber ?? '',
        this.registerForm.value.email ?? '',
        this.registerForm.value.phoneNumber ?? '',
        this.registerForm.value.acceptMarketingConsents ?? false
      ).subscribe({
        next: () => {
          this.router.navigate(['/auth/auth-code'], { 
            state: { 
              fromRegister : true,
              phoneNumber: this.registerForm.value.phoneNumber, 
              clientNumber: this.registerForm.value.clientNumber,
              email: this.registerForm.value.email,
              acceptTerms: this.registerForm.value.acceptTerms,
              acceptMarketingConsents: this.registerForm.value.acceptMarketingConsents
            } 
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