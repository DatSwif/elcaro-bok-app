import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentModeService {
  // Is the payment mode active
  private paymentModeSource = new BehaviorSubject<boolean>(false);
  isPaymentMode$ = this.paymentModeSource.asObservable();

  // Which invoices are currently checked
  selectedInvoicesSource = new BehaviorSubject<Set<number>>(new Set());
  selectedInvoices$ = this.selectedInvoicesSource.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => {
        this.togglePaymentMode(false);
      });
  }

  togglePaymentMode(isActive: boolean) {
    this.paymentModeSource.next(isActive);
    if (!isActive) {
      this.clearSelection(); // Uncheck when exiting payment mode
    }
  }

  toggleInvoice(invoiceId: number) {
    const currentSet = this.selectedInvoicesSource.value;
    if (currentSet.has(invoiceId)) {
      currentSet.delete(invoiceId);
    } else {
      currentSet.add(invoiceId);
    }
    // Emit a new copy of the Set to trigger change detection
    this.selectedInvoicesSource.next(new Set(currentSet));
  }

  selectInvoices(invoiceIds: number[]) {
    const currentSet = this.selectedInvoicesSource.value;
    invoiceIds.forEach(id => currentSet.add(id));
    this.selectedInvoicesSource.next(new Set(currentSet));
  }

  selectionEmpty() {
    return this.selectedInvoicesSource.value.size === 0;
  }

  clearSelection() {
    this.selectedInvoicesSource.next(new Set());
  }
}
