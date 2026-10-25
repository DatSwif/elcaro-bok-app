import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ServiceDetails } from '../service-details/service-details';
import { DrawerModule } from 'primeng/drawer';
import { CommonModule, Location } from '@angular/common';
import { ServicesService } from '../services-service';

@Component({
  selector: 'app-services-main',
  imports: [
    RouterModule,
    ServiceDetails,
    DrawerModule,
    CommonModule
  ],
  templateUrl: './services-main.html',
  styleUrl: './services-main.css',
})
export class ServicesMain {
  private servicesService = inject(ServicesService);
  
  private readonly indefinitePeriod: string = $localize`:@@services.indefinitePeriod:Czas nieokreślony`;

  statusMap: { [key: string]: string } = {
    'Pending': $localize`:@@status.pending:Oczekuje na uruchomienie`,
    'Blocked': $localize`:@@status.suspended:Blokada`,
    'Active': $localize`:@@status.active:Aktywny`,
    'Suspended': $localize`:@@status.inactive:Zawieszony`,
  };

  typeMap: { [key: string]: string } = {
    'Internet': $localize`:@@type.internet:Internet`,
    'Television': $localize`:@@type.television:Telewizja`,
    'Mobile': $localize`:@@type.mobile:Telefon`,
    'Other': $localize`:@@type.other:Inne`,
  };

  addresses: any[] = [];
  selectedAddressId: number | null = null;
  contract_start_date = '-';
  contract_end_date = '-';

  allServices: any[] = [];

  serviceDetailsOpen = false;
  serviceInDrawer: any = null;

  activeFilters: string[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    this.loadData();

    this.route.queryParamMap.subscribe(params => {
      const type = params.get('type');

      if (!type) {
        this.activeFilters = [];
        this.cdRef.detectChanges();
        return;
      }

      this.activeFilters = type
        .split('&')
        .map(v => this.getFilterType(v.trim()))
        .filter(Boolean);

      this.cdRef.detectChanges();
    });
  }

  private getFilterType(type: string): string {
    const knownTypes = ['Internet', 'Television', 'Mobile', 'Other'];
    return knownTypes.includes(type) ? type : 'Other';
  }

  loadData() {
    this.servicesService.getAddresses().subscribe(data => {
      this.addresses = data;
      this.cdRef.detectChanges();
    });

    this.servicesService.getServices().subscribe(data => {
      this.allServices = data;
      this.cdRef.detectChanges();
    });
  }

  get serviceInDrawerAddress() {
    if (!this.serviceInDrawer) {
      return '-';
    }

    return this.addresses.find(
      (addr) => addr.address_id === this.serviceInDrawer.address_id
    )?.address ?? '-';
  }

  get serviceTypeStats() {
    const addressFiltered =
      this.selectedAddressId === null || this.selectedAddressId === 0
        ? this.allServices
        : this.allServices.filter(s => s.address_id === this.selectedAddressId);

    const counts = {
      'Internet': addressFiltered.filter(s => this.getFilterType(s.service_type) === 'Internet').length,
      'Television': addressFiltered.filter(s => this.getFilterType(s.service_type) === 'Television').length,
      'Mobile': addressFiltered.filter(s => this.getFilterType(s.service_type) === 'Mobile').length,
      'Other': addressFiltered.filter(s => this.getFilterType(s.service_type) === 'Other').length,
    };

    return Object.entries(counts).map(([apiKey, count]) => ({
      apiKey,
      displayName: this.typeMap[apiKey] || apiKey,
      count
    }));
  }

  toggleFilter(apiKey: string) {
    const normalized = this.getFilterType(apiKey);

    if (this.activeFilters.includes(normalized)) {
      this.activeFilters = this.activeFilters.filter(f => f !== normalized);
    } else {
      this.activeFilters.push(normalized);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: this.activeFilters.length
          ? this.activeFilters.join('&')
          : null
      },
      queryParamsHandling: 'merge'
    });
  }

  get filteredServices() {
    let list = this.allServices;

    if (this.selectedAddressId !== null && this.selectedAddressId !== 0) {
      list = list.filter(s => s.address_id === this.selectedAddressId);
    }

    if (this.activeFilters.length > 0) {
      list = list.filter(s =>
        this.activeFilters.includes(this.getFilterType(s.service_type))
      );
    }

    return list;
  }

  onAddressChange(event: any) {
    const val = event.target.value;
    this.selectedAddressId = val === '0' ? null : Number(val);

    const addr = this.addresses.find(a => a.address_id === this.selectedAddressId);
    if (addr) {
      this.contract_start_date = addr.contract_active_from || this.indefinitePeriod;
      this.contract_end_date = addr.contract_active_until || this.indefinitePeriod;
    } else {
      this.contract_start_date = '-';
      this.contract_end_date = '-';
    }

    this.cdRef.detectChanges();
  }

  openServiceDetails(service: any) {
    this.serviceInDrawer = service;
    this.serviceDetailsOpen = true;
  }

  closeServiceDetails() {
    this.serviceDetailsOpen = false;
    this.serviceInDrawer = null;
  }
}