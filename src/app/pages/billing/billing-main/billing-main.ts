import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BillingService } from '../billing-service';
import { BillingAccountInfo } from '../billing-account-info/billing-account-info';
import { PaymentModeService } from '../payment-mode-service';

interface tabItem {
  id: string;       // internal id
  route: string;    // router path (without leading slash)
  label: string;
  isActive: boolean;
}

interface AccountInfo {
  account_number: string;
  balance: number;
}

@Component({
  selector: 'app-billing-main',
  imports: [
    RouterModule,
    CommonModule,
    BillingAccountInfo
  ],
  templateUrl: './billing-main.html',
  styleUrl: './billing-main.css',
})
export class BillingMain {
  paymentModeService = inject(PaymentModeService);

  private billingService = inject(BillingService);
  account : AccountInfo = {
    account_number: '',
    balance: 0
  };

  constructor(
    private cdRef : ChangeDetectorRef, 
    private router : Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  tabItems: tabItem[] = [
    {
      id: 'unpaid',
      route: 'unpaid',
      label: $localize`:@@billing.tabs.unpaid:Do zapłaty`,
      isActive: true
    },
    {
      id: 'paid',
      route: 'paid',
      label: $localize`:@@billing.tabs.paid:Zapłacone`,
      isActive: true
    },
    {
      id: 'payments',
      route: 'payments',
      label: $localize`:@@billing.tabs.payments:Wpłaty`,
      isActive: true
    },
    {
      id: 'returns',
      route: 'returns',
      label: $localize`:@@billing.tabs.returns:Zwroty nadpłat`,
      isActive: true
    },
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.billingService.getAccountInfo().subscribe(data => {
      this.account = data;
      this.cdRef.detectChanges();
    });
  }

  goToPay(): void {
    if (this.router.url.includes('/paid')) {
      this.router.navigate(['/billing/unpaid']);
    }
  }

  goToRefunds(): void {
    this.router.navigate(['/billing/returns'], { 
      queryParams: { action: 'new-return' } 
    });
  }

  onAccountCopied(value: string): void {
    console.log('Copied:', value);
  }
}
