import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import {
  SettingsService,
  NotificationSettingDto,
  NotificationSettingsResponse,
  UpdateNotificationSettingsRequest,
} from '../../settings-service';
import { LanguageUtilsService } from '../../../../shared/language-utils-service';
import { ErrorService } from '../../../../shared/error-service';

type ChannelKey = 'EMAIL' | 'SMS' | 'SYSTEM';

interface NotifItem {
  id: number;
  code: string;
  title: string;
  channels: Record<ChannelKey, boolean>;
}

@Component({
  selector: 'app-lang-notif-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ToggleSwitchModule],
  templateUrl: './lang-notif-settings.html',
  styleUrl: './lang-notif-settings.css',
})
export class LangNotifSettings implements OnInit {
  langUtils = inject(LanguageUtilsService);

  readonly ready = signal(false);
  readonly selectedLanguage = signal('pl');
  readonly notifItems = signal<NotifItem[]>([]);

  readonly langItems = [
    { id: 'pl', title: 'Polski' },
    { id: 'en', title: 'English' },
  ];

  readonly channels: { key: ChannelKey; label: string }[] = [
    { key: 'EMAIL', label: 'e-mail' },
    { key: 'SMS', label: 'sms' },
    { key: 'SYSTEM', label: 'system' },
  ];

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    void this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    this.ready.set(false);

    try {
      const response = await firstValueFrom(
        this.settingsService.getNotificationSettings()
      );

      this.applyResponse(response);
      this.ready.set(true);
    } catch (err) {
      console.error('Failed to load notification settings', err);
      this.selectedLanguage.set('pl');
      this.notifItems.set([]);
    }
  }

async saveSettings(): Promise<void> {
  const payload: UpdateNotificationSettingsRequest = {
    language_code: this.selectedLanguage(),
    notifications: this.notifItems().flatMap((item) =>
      this.channels.map((channel) => ({
        notificationTypeId: item.id,
        notificationTypeCode: item.code,
        notificationTypeName: item.title,
        channel: channel.key,
        enabled: item.channels[channel.key],
      }))
    ),
  };

  try {
    const response = await firstValueFrom(
      this.settingsService.updateNotificationSettings(payload)
    );

    this.errorService.showError(
      $localize`:@@success.saved.title:Sukces`,
      $localize`:@@success.saved:Zmiany zostały zapisane.`,
      'success'
    );

    this.applyResponse(response);

    this.langUtils.processLanguageChange(response.language_code);
  } catch (err) {
    console.error('Failed to save notification settings', err);
  }
}

  private applyResponse(response: NotificationSettingsResponse): void {
    const backendLang = response.language_code || 'pl';
    
    this.selectedLanguage.set(backendLang);
    
    this.notifItems.set(this.mapNotificationsToUi(response.notifications ?? []));
  }

  private mapNotificationsToUi(items: NotificationSettingDto[]): NotifItem[] {
    const grouped = new Map<number, NotifItem>();

    for (const item of items) {
      const channel = item.channel as ChannelKey;

      if (!grouped.has(item.notificationTypeId)) {
        grouped.set(item.notificationTypeId, {
          id: item.notificationTypeId,
          code: item.notificationTypeCode,
          title: item.notificationTypeName,
          channels: {
            EMAIL: false,
            SMS: false,
            SYSTEM: false,
          },
        });
      }

      const row = grouped.get(item.notificationTypeId)!;

      if (channel in row.channels) {
        row.channels[channel] = item.enabled;
      }
    }

    return Array.from(grouped.values());
  }
}