import { Component, inject, Input, signal } from '@angular/core';
import { BillingService } from '../billing-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReturnForm } from '../return-form/return-form';

@Component({
  selector: 'app-billing-returns',
  imports: [ReturnForm],
  templateUrl: './billing-returns.html',
  styleUrl: './billing-returns.css',
})
export class BillingReturns {
  billingService = inject(BillingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  returns = signal<any[] | null>(null);

  isReturnFormVisible = false;
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new-return') {
        this.isReturnFormVisible = true;
      } else {
        this.isReturnFormVisible = false;
      }
    });
    this.billingService.getReturns().subscribe(returns => {
      this.returns.set(returns);
    });
  }

  onCloseDrawer() {
    this.router.navigate(['/billing/returns'], { 
      queryParams: {} // This clears the ?action=new-return
    });
  }
}
