import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HardwareItem } from './hardware-item/hardware-item';
import { HardwareItemDto, SettingsService } from '../../settings-service';

type NormalizedHardwareOwner = 'RENTED' | 'OWNED' | 'OTHER';

interface DisplayHardwareItem extends Omit<HardwareItemDto, 'owner'> {
  owner: NormalizedHardwareOwner;
}

@Component({
  selector: 'app-hardware-settings',
  standalone: true,
  imports: [CommonModule, HardwareItem],
  templateUrl: './hardware-settings.html',
  styleUrl: './hardware-settings.css',
})
export class HardwareSettings implements OnInit {
  readonly ready = signal(false);
  readonly groupByService = signal(false);
  readonly hardwareItems = signal<DisplayHardwareItem[]>([]);

  readonly ownerMap: Record<NormalizedHardwareOwner, string> = {
    RENTED: $localize`:@@hardware.owner.rented:Wynajęty`,
    OWNED: $localize`:@@hardware.owner.owned:Własny`,
    OTHER: $localize`:@@hardware.owner.other:Inne`,
  };

  readonly servicesList = computed(() => {
    const map = new Map<string, string>();

    for (const item of this.hardwareItems()) {
      if (!map.has(item.serviceType)) {
        map.set(item.serviceType, item.serviceType);
      }
    }

    return Array.from(map.entries()).map(([type, label]) => ({ type, label }));
  });

  readonly groupedHardware = computed<Record<string, DisplayHardwareItem[]>>(() => {
    const grouped: Record<string, DisplayHardwareItem[]> = {};

    for (const item of this.hardwareItems()) {
      (grouped[item.serviceType] ??= []).push(item);
    }

    return grouped;
  });

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    void this.loadHardware();
  }

  async loadHardware(): Promise<void> {
    try {
      this.ready.set(false);
      const items = await firstValueFrom(this.settingsService.getHardware());
      this.hardwareItems.set(this.normalizeHardwareItems(items));
      this.ready.set(true);
    } catch (err) {
      console.error('Failed to load hardware', err);
    }
  }

  private normalizeOwner(owner: string): NormalizedHardwareOwner {
    switch (owner) {
      case 'RENTED':
      case 'OWNED':
      case 'OTHER':
        return owner;
      default:
        return 'OTHER';
    }
  }

  private normalizeHardwareItems(
    items: HardwareItemDto[]
  ): DisplayHardwareItem[] {
    return items.map((item) => ({
      ...item,
      owner: this.normalizeOwner(item.owner),
    }));
  }

  getOwnerTitle(owner: string): string {
    return this.ownerMap[this.normalizeOwner(owner)];
  }

  onGroupByServiceChange(event: Event): void {
    this.groupByService.set((event.target as HTMLInputElement).checked);
  }
}