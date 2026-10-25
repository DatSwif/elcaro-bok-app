import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface tabItem {
  id: string;       // internal id
  route: string;    // router path (without leading slash)
  label: string;
  isActive: boolean;
}

@Component({
  selector: 'app-settings-header',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './settings-header.html',
  styleUrl: './settings-header.css',
})
export class SettingsHeader {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  tabItems: tabItem[] = [
    {
      id: 'account',
      route: 'account',
      label: $localize`:@@settings-header.tabs.account:Konto`,
      isActive: true
    },
    {
      id: 'settings',
      route: 'lang-notif',
      label: $localize`:@@settings-header.tabs.settings:Ustawienia`,
      isActive: true
    },
    {
      id: 'terms-of-service',
      route: 'terms-of-service',
      label: $localize`:@@settings-header.tabs.termsOfService:Regulamin`,
      isActive: true
    },
    {
      id: 'privacy-policy',
      route: 'privacy-policy',
      label: $localize`:@@settings-header.tabs.privacyPolicy:Polityka prywatności`,
      isActive: true
    },
    {
      id: 'hardware',
      route: 'hardware',
      label: $localize`:@@settings-header.tabs.hardware:Sprzęt`,
      isActive: true
    },
    {
      id: 'marketing-consents',
      route: 'marketing-consents',
      label: $localize`:@@settings-header.tabs.marketingConsents:Zgody marketingowe`,
      isActive: true
    }
  ];
}
