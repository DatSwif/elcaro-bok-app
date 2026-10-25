import { Component, computed, inject, Input, Signal } from '@angular/core';
import { BillingService } from '../billing-service';
import { NgClass, DatePipe, AsyncPipe } from '@angular/common';
import { PaymentModeService } from '../payment-mode-service';
import { InvoiceDetails } from '../invoice-details/invoice-details';
import { TransferDetails } from '../transfer-details/transfer-details';

interface InvoiceShort {
  id: number,
  invoice_number: string,
  issue_date: string,
  due_date: string,
  period_start: string,
  period_end: string,
  status: string,
  total_amount: number,
  document_id: string
}

@Component({
  selector: 'app-billing-invoices',
  imports: [NgClass, DatePipe, AsyncPipe, InvoiceDetails, TransferDetails],
  templateUrl: './billing-invoices.html',
  styleUrl: './billing-invoices.css',
})
export class BillingInvoices {
  paymentModeService = inject(PaymentModeService);

  billingService = inject(BillingService);

  @Input() statuses!: string[];

  filteredInvoices : Signal<InvoiceShort[] | null> = computed(() => {
    const allInvoices = this.billingService.invoices();
    
    if (!allInvoices) return null;

    return allInvoices.filter(invoice => this.statuses.includes(invoice.status.toLowerCase()));
  });

  invoiceInDrawer : InvoiceShort | null = null;
  activeDrawer : "None" | "TransferDetails" | "InvoiceDetails" = "None";

  ngOnInit() {
    this.billingService.loadInvoices();
  }

  viewInvoiceDetails(invoice: InvoiceShort) {
    this.invoiceInDrawer = invoice;
    this.activeDrawer = "InvoiceDetails";
  }

  viewTransferDetails() {
    this.activeDrawer = "TransferDetails";
  }

  get hasUnpaidStatus(): boolean {
    return this.statuses?.map(a => a.toLowerCase()).includes('unpaid') ?? false;
  }

  selectOverdueInvoices(): void {
    const invoices = this.filteredInvoices() || [];
    const overdueIds = invoices
      .filter(invoice => invoice.status?.toLowerCase() === 'overdue')
      .map(invoice => invoice.id);
      
    this.paymentModeService.selectInvoices(overdueIds);
  }

  selectAllInvoices(): void {
    const invoices = this.filteredInvoices() || [];
    const allIds = invoices.map(invoice => invoice.id);
    
    this.paymentModeService.selectInvoices(allIds);
  }
  
  getSelectedInvoicesTotal() {
    const totalToPay = this.filteredInvoices()!.reduce((sum, invoice) => {
      return this.paymentModeService.selectedInvoicesSource.value.has(invoice.id) 
        ? sum + invoice.total_amount 
        : sum;
    }, 0);
    return totalToPay;
  }

  closeDrawer() {
    this.activeDrawer = "None";
    this.invoiceInDrawer = null;
  }
}
