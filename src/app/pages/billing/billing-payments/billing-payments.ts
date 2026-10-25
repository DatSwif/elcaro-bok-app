import { Component, inject, signal } from '@angular/core';
import { BillingService } from '../billing-service';

@Component({
  selector: 'app-billing-payments',
  imports: [],
  templateUrl: './billing-payments.html',
  styleUrl: './billing-payments.css',
})
export class BillingPayments {
  billingService = inject(BillingService);

  payments = signal<any[] | null>(null);

  ngOnInit() {
    this.billingService.getPayments().subscribe(payments => {
      this.payments.set(payments);
    });
  }
}
