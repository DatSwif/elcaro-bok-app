import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CarouselModule } from 'primeng/carousel';
import { BillingAccountInfo } from '../../billing/billing-account-info/billing-account-info';
import {
  AccountInfo,
  DashboardResponse,
  DashboardService,
  Message,
  Offer,
  ServiceItem,
} from '../dashboard-service';

type NormalizedServiceType = 'Internet' | 'Television' | 'Mobile' | 'Other';

interface DisplayServiceItem {
  service_type: NormalizedServiceType;
  activeCount: number;
}

@Component({
  selector: 'app-dashboard-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    BillingAccountInfo,
  ],
  templateUrl: './dashboard-main.html',
  styleUrl: './dashboard-main.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardMain implements OnInit {
  private readonly router = inject(Router);
  private readonly dashboardService = inject(DashboardService);

  readonly account = signal<AccountInfo>({
    account_number: '',
    balance: 0,
  });

  readonly messages = signal<Message[]>([]);
  readonly services = signal<DisplayServiceItem[]>([]);
  readonly offers = signal<Offer[]>([]);

  readonly messagePage = signal(0);
  readonly numVisible = signal(1);
  readonly ready = signal(false);

  private readonly failedImageIds = signal<Set<number>>(new Set<number>());

  readonly typeMap: Record<NormalizedServiceType, string> = {
    Internet: $localize`:@@type.internet:Internet`,
    Television: $localize`:@@type.television:Telewizja`,
    Mobile: $localize`:@@type.mobile:Telefon`,
    Other: $localize`:@@type.other:Inne`,
  };

  readonly iconMap: Record<NormalizedServiceType, string> = {
    Internet: 'assets/icons/fi-rr-disco-ball.svg',
    Television: 'assets/icons/fi-rr-screen.svg',
    Mobile: 'assets/icons/fi-rr-smartphone.svg',
    Other: 'assets/icons/fi-rr-web.svg',
  };

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  async loadDashboard(): Promise<void> {
    try {
      this.ready.set(false);

      const dashboard: DashboardResponse = await firstValueFrom(
        this.dashboardService.getDashboard()
      );

      this.account.set(dashboard.account);
      this.messages.set(dashboard.messages);
      this.services.set(this.normalizeAndAggregateServices(dashboard.services));
      this.offers.set(dashboard.offers);

      this.ready.set(true);
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  }

  private normalizeServiceType(type: string): NormalizedServiceType {
    switch (type) {
      case 'Internet':
      case 'Television':
      case 'Mobile':
      case 'Other':
        return type;
      default:
        return 'Other';
    }
  }

  private normalizeAndAggregateServices(
    services: ServiceItem[]
  ): DisplayServiceItem[] {
    const map = new Map<NormalizedServiceType, number>();

    for (const service of services) {
      const normalizedType = this.normalizeServiceType(service.service_type);
      const currentCount = map.get(normalizedType) ?? 0;
      map.set(normalizedType, currentCount + service.activeCount);
    }

    return Array.from(map.entries()).map(([service_type, activeCount]) => ({
      service_type,
      activeCount,
    }));
  }

  getServiceTitle(serviceType: string): string {
    return this.typeMap[this.normalizeServiceType(serviceType)];
  }

  getServiceIcon(serviceType: string): string {
    return this.iconMap[this.normalizeServiceType(serviceType)];
  }

  getPreview(text: string, limit = 60): string {
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  maxMessagePage(): number {
    return Math.max(0, this.messages().length - this.numVisible());
  }

  messagesNumber(): number {
    return this.messages().length;
  }

  shouldShowGradient(offer: Offer): boolean {
    return !offer.image_url || this.failedImageIds().has(offer.id);
  }

  handleImageError(id: number): void {
    this.failedImageIds.update((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  prevMessage(): void {
    this.messagePage.update((page) => Math.max(0, page - 1));
  }

  nextMessage(): void {
    this.messagePage.update((page) =>
      Math.min(this.maxMessagePage(), page + 1)
    );
  }

  openMessage(id: number): void {
    this.router.navigate(['/messages'], {
      queryParams: { id },
    });
  }

  openServices(type: string): void {
    this.router.navigate(['/services'], {
      queryParams: { type: this.normalizeServiceType(type) },
    });
  }

  openOffer(id: number): void {
    this.router.navigate(['/offers/details', id]);
  }

  goToPay(): void {
    this.router.navigate(['/billing/unpaid']);
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