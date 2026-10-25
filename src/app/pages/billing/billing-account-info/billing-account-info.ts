import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PaymentModeService } from '../payment-mode-service';
import { ClipboardUtilsService } from '../../../shared/clipboard-utils-service';

export interface AccountInfo {
  account_number: string;
  balance: number;
}

@Component({
  selector: 'app-billing-account-info',
  imports: [CommonModule],
  templateUrl: './billing-account-info.html',
  styleUrl: './billing-account-info.css',
})
export class BillingAccountInfo {
  @Input({ required: true }) account!: AccountInfo;

  @Output() pay = new EventEmitter<void>();
  @Output() refund = new EventEmitter<number>();
  @Output() copied = new EventEmitter<string>();

  clipboardService = inject(ClipboardUtilsService);
  paymentModeService = inject(PaymentModeService);

  copyAccountNumber(): void {
    this.clipboardService.copyText(this.account.account_number);
  }

  onPay(): void {
    this.pay.emit();
    this.paymentModeService.togglePaymentMode(true);
  }

  onRefund(): void {
    this.refund.emit(this.account.balance);
  }
}