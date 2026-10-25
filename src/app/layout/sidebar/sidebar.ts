import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;       // internal id (used for activeTab)
  route: string;    // router path (without leading slash)
  icon: string;
  label: string;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar {
  mobileSidebarVisible: boolean = false;

  constructor(private router: Router) {}

  // Main menu (routes are the path segments).
  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      route: 'dashboard',
      icon: 'assets/icons/fi-rr-house.svg',
      label: $localize`:@@sidebar.dashboard:Pulpit`,
      isActive: true
    },
    {
      id: 'billing',
      route: 'billing/unpaid',
      icon: 'assets/icons/fi-rr-credit-card.svg',
      label: $localize`:@@sidebar.billing:Płatności`,
      isActive: true
    },
    {
      id: 'services',
      route: 'services',
      icon: 'assets/icons/fi-rr-apps.svg',
      label: $localize`:@@sidebar.services:Usługi`,
      isActive: true
    },
    {
      id: 'offers',
      route: 'offers',
      icon: 'assets/icons/fi-rr-shop.svg',
      label: $localize`:@@sidebar.offers:Oferta`,
      isActive: true
    },
    {
      id: 'help',
      route: 'help',
      icon: 'assets/icons/fi-rr-life-ring.svg',
      label: $localize`:@@sidebar.help:Pomoc`,
      isActive: true
    },
    {
      id: 'messages',
      route: 'messages',
      icon: 'assets/icons/fi-rr-inbox.svg',
      label: $localize`:@@sidebar.messages:Wiadomości`,
      isActive: true
    },
    {
      id: 'settings',
      route: 'settings',
      icon: 'assets/icons/fi-rr-settings.svg',
      label: $localize`:@@sidebar.settings:Ustawienia`,
      isActive: true
    }
  ];

  // Bottom menu (chat).
  bottomItems: MenuItem[] = [
    {
      id: 'chat',
      route: 'chat',
      icon: 'assets/icons/fi-rr-comments.svg',
      label: $localize`:@@sidebar.chat:Chat`,
      isActive: false
    }
  ];

  selectTab(item: MenuItem) {
    this.mobileSidebarVisible = false;
  }
}