import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ServicesService } from '../services-service';
import { Drawer } from "primeng/drawer";
import { SharedModule } from 'primeng/api';
import { PackageDetails } from '../package-details/package-details';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-details',
  imports: [
    Drawer,
    SharedModule,
    CommonModule,
    PackageDetails,
    PopoverModule,
    Popover
  ],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  @Input() address : any;
  @Input() serviceId : any;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  service : any;

  private servicesService = inject(ServicesService);
  
  packageDialogOpen = false;
  selectedPackageForDialog: any = null;
  
  hoverTimeout: any;
  hoveredChannels: any[] = [];

  constructor(private cdRef : ChangeDetectorRef) {}
  
  ngOnInit() {
    this.loadDetails();
  }

  loadDetails() {
    this.servicesService.getServiceDetails(this.serviceId).subscribe(data => {
      this.service = data;
      this.cdRef.detectChanges();
    });
  }

  onPackageHover(event: Event, channels: any[], target: HTMLElement, op: any) {
    clearTimeout(this.hoverTimeout);

    this.hoveredChannels = channels;
    this.hoverTimeout = setTimeout(() => {
      op.show(event, target);
      this.cdRef.detectChanges();
    }, 50); 
  }

  onPackageLeave(op: any) {
    clearTimeout(this.hoverTimeout);
    op.hide();
  }

  getPictogram(channel : any) {
    return PackageDetails.getPictogram(channel);
  }

  deletePackage(packageId : any) {
    this.servicesService.deletePackage(this.serviceId, packageId).subscribe(() => {});
    this.loadDetails();
  }

  closeDrawer() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  openPackageDetails(pkg: any) {
    this.selectedPackageForDialog = pkg;
    this.packageDialogOpen = true;
  }
}
