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
  selector: 'app-messages-header',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './messages-header.html',
  styleUrl: './messages-header.css',
})
export class MessagesHeader {
  constructor(private router: Router,  private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  tabItems: tabItem[] = [
    {
      id: 'global',
      route: 'global',
      label: $localize`:@@messages-header.tabs.global:Wiadomości`,
      isActive: true
    },
    {
      id: 'personal',
      route: 'personal',
      label: $localize`:@@messages-header.tabs.personal:Powiadomienia`,
      isActive: true
    },
  ];
}
