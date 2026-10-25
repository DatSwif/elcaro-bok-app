import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../shared/document-service/document-service';
import { DocumentViewer } from '../../../shared/document-viewer/document-viewer';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../services-service';
import { SmsConfirmation } from '../../../shared/sms-confirmation/sms-confirmation';

@Component({
  selector: 'app-package-details',
  imports: [DialogModule, CheckboxModule, FormsModule, DocumentViewer, CommonModule, SmsConfirmation],
  templateUrl: './package-details.html',
  styleUrl: './package-details.css',
})
export class PackageDetails {
  @Input() visible = false;
  @Input() serviceName : any;
  @Input() packageDetails : any;
  @Input() serviceId! : number;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onPackageAdded = new EventEmitter<void>();

  private cdr = inject(ChangeDetectorRef);
  private servicesService = inject(ServicesService);


  dialogState = signal<'DETAILS' | 'VERIFY_CODE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('DETAILS');
  phoneNumbers = signal<string[]>([]);
  chosenPhone = signal<string>('');
  acceptedTerms = false;

  constructor (public documentService: DocumentService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.resetDialog();
      this.loadPhoneNumbers();
    }
  }

  loadPhoneNumbers() {
    this.servicesService.getClientPhoneNumbers().subscribe({
      next: (numbers) => this.phoneNumbers.set(numbers),
      error: () => console.error('Failed to load phone numbers')
    });
  }

  // Call /init
  initiateSmsVerification() {
    if (!this.packageDetails || !this.chosenPhone() || !this.acceptedTerms) return;

    this.dialogState.set('LOADING');

    this.servicesService.postInitAddPackage(this.serviceId, this.packageDetails.id, this.chosenPhone()).subscribe({
      next: () => this.dialogState.set('VERIFY_CODE'),
      error: () => this.dialogState.set('ERROR')
    });
  }

  // Call /verify
  onVerifySmsCode(code: string) {
    this.dialogState.set('LOADING');

    this.servicesService.postVerifyAddPackage(this.serviceId, this.packageDetails.id, this.chosenPhone(), code).subscribe({
      next: () => {
        this.dialogState.set('SUCCESS');
        this.onPackageAdded.emit(); // Alert the parent component so it can refresh the UI
      },
      error: () => this.dialogState.set('ERROR')
    });
  }

  async showPromotionRegulations() {
    const promotionDoc = await firstValueFrom(this.documentService.getPromotionRegulations());
    this.cdr.detectChanges();
    this.documentService.showDocument(promotionDoc);
    this.cdr.detectChanges();
  }

  private static channelPictogramsMap: { [key: string]: string } = {
    'TVP 1': 'assets/icons/tvp1-logo.png',
    'Polsat': 'assets/icons/polsat-logo.png',
    'TVP 2': 'assets/icons/tvp2-logo.png',
    'TVN': 'assets/icons/tvn-logo.png',
    'Canal+ Sport': 'assets/icons/canalplussport-logo.png',
    'TVP Sport': 'assets/icons/tvpsport-logo.png',
    'HBO': 'assets/icons/hbo-logo.png',
    'Filmbox': 'assets/icons/filmbox-logo.png',
    'MiniMini+': 'assets/icons/miniminiplus-logo.png',
    'Cartoon Network': 'assets/icons/cartoonnetwork-logo.png',
  };

  static getPictogram(channel : any) {
    // If the channel name is in the map, return its pictogram path
    if (PackageDetails.channelPictogramsMap[channel.name]) {
      return PackageDetails.channelPictogramsMap[channel.name];
    } else if (channel.pictogram) { // not in the map but backend returned a url
      return channel.pictogram;
    } else {
      // return default channel pictogram
      return 'assets/icons/default-channel-logo.png';
    }
  }

  getPictogram(channel : any) {
    return PackageDetails.getPictogram(channel);
  }
  
  onResendSmsCode() {
    this.initiateSmsVerification();
  }

  resetDialog() {
    this.dialogState.set('DETAILS');
    this.chosenPhone.set('');
    this.acceptedTerms = false;
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
