import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { BillingService } from '../billing-service';
import { DrawerModule } from 'primeng/drawer';
import { ClipboardUtilsService } from '../../../shared/clipboard-utils-service';
import { DecimalPipe } from '@angular/common';

interface TransferData {
  receiver : string,
  receiver_address : string,
  bank_account : string,
  transfer_title : string;
  transfer_amount : number;
}

@Component({
  selector: 'app-transfer-details',
  imports: [DrawerModule, DecimalPipe],
  templateUrl: './transfer-details.html',
  styleUrl: './transfer-details.css',
})
export class TransferDetails {
  billingService = inject(BillingService);
  clipboardService = inject(ClipboardUtilsService);

  apiData : any;
  data : TransferData | undefined;

  @Input() transfer_title! : string;
  @Input() transfer_amount! : number;

  @Output() close = new EventEmitter<void>();

  visible = true;

  constructor(private cdRef : ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.billingService.getTransferDetails().subscribe(data => {
      this.data = {
        receiver: data.receiver,
        receiver_address: data.receiver_address,
        bank_account: data.bank_account,
        transfer_title: this.transfer_title,
        transfer_amount: this.transfer_amount
      };
      console.log(this.data);
      this.cdRef.detectChanges();
    });
  }
  
  copyText(text : string) {
    this.clipboardService.copyText(text);
  }

  onDrawerHidden() {
    this.close.emit();
  }
}
