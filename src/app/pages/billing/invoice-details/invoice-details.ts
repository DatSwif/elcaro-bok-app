import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { BillingService } from '../billing-service';
import { DrawerModule } from 'primeng/drawer';
import { DocumentService } from '../../../shared/document-service/document-service';
import { firstValueFrom } from 'rxjs';

interface InvoiceData {
  id: number,
  invoice_number: string,
  status: string,
  dates: {
    issue_date: string,
    sale_date: string,
    due_date: string,
    period_start: string,
    period_end: string
  },
  seller: {
    name: string,
    address: string,
    nip: string
  },
  buyer: {
    name: string,
    subscriber_number: string,
    address: string
  },
  line_items: [
    {
      description: string,
      quantity: number,
      unit: string,
      vat_rate: number,
      net_price: number,
      gross_price: number
    },
    {
      description: string,
      quantity: number,
      unit: string,
      vat_rate: number,
      net_price: number,
      gross_price: number
    }
  ],
  totals: {
    total_net: number,
    total_gross: number
  },
  payment_details: {
    method: string,
    bank_account: string
  }
}

@Component({
  selector: 'app-invoice-details',
  imports: [DrawerModule],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.css',
})
export class InvoiceDetails {
  @Input() invoiceId : any;
  @Input() documentId! : string;

  billingService = inject(BillingService);
  documentService = inject(DocumentService);

  data : InvoiceData | undefined;

  @Output() close = new EventEmitter<void>();

  visible = true;

  constructor(private cdRef : ChangeDetectorRef) {}
  
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.billingService.getInvoiceDetails(this.invoiceId).subscribe(data => {
      this.data = data;
      this.cdRef.detectChanges();
    });
  }

  onDrawerHidden() {
    this.close.emit();
  }

  async downloadInvoice() {
    if (!this.data) {
      return;
    }

    try {
      const blob = await firstValueFrom(this.billingService.getInvoicePdf(this.data.id));
      
      const url = URL.createObjectURL(blob);
      
      const anchor = document.createElement('a');
      anchor.href = url;
      
      const fileName = this.data.invoice_number 
        ? $localize`:@@billing.invoice:Faktura_${this.data.invoice_number.replace(/\s+/g, '_')}` 
        : $localize`:@@billing.invoice:Faktura_${this.data.id}`;
        
      anchor.download = `${fileName}.pdf`;
      
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.debug('Invoice download process aborted or failed.');
    }
  }
}
