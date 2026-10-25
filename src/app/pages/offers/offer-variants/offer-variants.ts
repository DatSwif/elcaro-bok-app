import { Component, inject, OnInit, signal } from '@angular/core';
import { OffersService } from '../offers-service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SmsConfirmation } from '../../../shared/sms-confirmation/sms-confirmation';

interface OfferVariant {
  id: number;
  name: string;
  pricing: {
    regular_price: number;
    current_price: number;
    period: string;
    promo_description: string;
  };
  blocks: any[];
}

export interface OfferDetails {
  id: number;
  title: string;
  subtitle: string;
  legal_note: string;
  variants: OfferVariant[];
}

@Component({
  selector: 'app-offer-variants',
  imports: [RouterModule, DialogModule, FormsModule, SmsConfirmation],
  templateUrl: './offer-variants.html',
  styleUrl: './offer-variants.css',
})
export class OfferVariants implements OnInit {
  private readonly BLOCK_ORDER: Record<string, number> = {
    'PROMO_BADGE': 1,
    'INTERNET_SERVICE': 2,
    'TV_PACKAGES': 3,
    'MOBILE_PLAN': 4,
    'PREMIUM_ADDONS': 5,
    'HARDWARE': 6,
    // other types default to 50
    'CONTRACT_CONDITIONS': 999
  };

  private offersService = inject(OffersService);

  offerId!: number;
  
  offer = signal<OfferDetails | undefined>(undefined);
  errorType = signal<string>('');
  selectedVariantId: number | null = null;
  
  dialogVisible = signal(false);
  dialogState = signal<'CONFIRM' | 'LOADING' | 'SUCCESS' | 'ERROR' | 'VERIFY_CODE'>('CONFIRM');
  
  phoneNumbers = signal<string[]>([]);
  chosenPhone = signal<string>('');

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();
  }

  private loadData() {
    this.offersService.getVariants(this.offerId).subscribe({
      next: (data) => {
        data.variants.forEach(variant => {
          if (variant.blocks) {
            variant.blocks.sort((a, b) => {
              const weightA = this.BLOCK_ORDER[a.type] ?? 50;
              const weightB = this.BLOCK_ORDER[b.type] ?? 50;
              
              return weightA - weightB;
            });
          }
        });
        this.offer.set(data);
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorType.set('NOT_FOUND');
        } else if (err.status === 403) {
          this.errorType.set('UNAVAILABLE');
        }
      }
    });
  }
  
  goToConfirmation(variant: number) {
    this.selectedVariantId = variant;
    this.dialogState.set('LOADING');
    this.dialogVisible.set(true);

    this.offersService.getClientPhoneNumbers().subscribe({
      next: (numbers) => {
        this.phoneNumbers.set(numbers);
        this.dialogState.set('CONFIRM');
      },
      error: () => {
        this.dialogState.set('ERROR');
      }
    });
  }

  // Trigger the /init endpoint with chosen data
  initiateSmsVerification() {
    if (!this.chosenPhone() || !this.selectedVariantId) return;
    
    this.dialogState.set('LOADING');
    
    this.offersService.postInitAddVariant(this.offerId, this.selectedVariantId, this.chosenPhone()).subscribe({
      next: () => {
        this.dialogState.set('VERIFY_CODE');
      },
      error: () => {
        this.dialogState.set('ERROR');
      }
    });
  }

  // Call the /verify endpoint with the user's OTP string
  onVerifySmsCode(code: string) {
    if (!this.selectedVariantId) return;

    this.dialogState.set('LOADING');

    this.offersService.postVerifyAddVariant(this.offerId, this.selectedVariantId, this.chosenPhone(), code).subscribe({
      next: () => {
        this.dialogState.set('SUCCESS');
      },
      error: () => {
        this.dialogState.set('ERROR');
      }
    });
  }

  // Handle the resend output hook from the nested component
  onResendSmsCode() {
    this.initiateSmsVerification();
  }

  resetDialog() {
    this.dialogState.set('CONFIRM');
    this.selectedVariantId = null;
    this.chosenPhone.set('');
    this.phoneNumbers.set([]);
  }

  goBack() {
    this.dialogVisible.set(false);
    this.location.back();
  }
}
