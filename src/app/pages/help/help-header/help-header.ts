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
  selector: 'app-help-header',
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './help-header.html',
  styleUrl: './help-header.css',
})
export class HelpHeader {
  constructor(private router: Router, private location: Location) {}

  goBack(): void {
    this.location.back();
  }

  tabItems: tabItem[] = [
    {
      id: 'contact',
      route: 'contact',
      label: $localize`:@@help-header.tabs.contact:Kontakt`,
      isActive: true
    },
    {
      id: 'faq',
      route: 'faq',
      label: $localize`:@@help-header.tabs.faq:FAQ`,
      isActive: true
    },
  ];
}
