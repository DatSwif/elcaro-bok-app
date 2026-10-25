import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SettingsService, ConsentDto, UpdateConsentRequest } from '../../settings-service';
import { ErrorService } from '../../../../shared/error-service';

interface ConsentBox {
  code: string;
  title: string;
  description: string;
  checked: boolean;
  editable: boolean;
  grantedAt: string | null;
}

@Component({
  selector: 'app-marketing-consents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketing-consents.html',
  styleUrl: './marketing-consents.css',
})
export class MarketingConsents implements OnInit {
  readonly consentBoxes = signal<ConsentBox[]>([]);
  readonly isReady = signal(false);

  constructor(private settingsService: SettingsService, private errorService: ErrorService) {}

  ngOnInit(): void {
    void this.loadConsents();
  }

  async loadConsents(): Promise<void> {
    try {
      this.isReady.set(false);

      const items = await firstValueFrom(
        this.settingsService.getConsents()
      );

      const mapped: ConsentBox[] = items.map((item: ConsentDto) => ({
        code: item.code,
        title: item.title,
        description: item.description,
        checked: item.isGranted,
        editable: item.isEditable,
        grantedAt: item.grantedAt,
      }));

      this.consentBoxes.set(mapped);
      this.isReady.set(true);
    } catch (err) {
      console.error('Failed to load consents', err);
    }
  }

  allChecked(): boolean {
    const editable = this.consentBoxes().filter((i) => i.editable);
    return editable.length > 0 && editable.every((i) => i.checked);
  }

  toggleAll(): void {
    const shouldCheck = !this.allChecked();

    this.consentBoxes.update((items) =>
      items.map((item) =>
        item.editable ? { ...item, checked: shouldCheck } : item
      )
    );
  }

  onToggle(code: string, value: boolean): void {
    this.consentBoxes.update((items) =>
      items.map((item) =>
        item.code === code ? { ...item, checked: value } : item
      )
    );
  }

  async saveConsents(): Promise<void> {
    const payload: UpdateConsentRequest[] = this.consentBoxes()
      .filter((i) => i.editable)
      .map((i) => ({
        code: i.code,
        isGranted: i.checked,
      }));

    try {
      await firstValueFrom(this.settingsService.updateConsents(payload));

      this.errorService.showError(
        $localize`:@@success.saved.title:Sukces`,
        $localize`:@@success.saved:Zmiany zostały zapisane.`,
        'success'
      );

      await this.loadConsents();
    } catch (err) {
      console.error('Failed to save consents', err);
    }
  }
}