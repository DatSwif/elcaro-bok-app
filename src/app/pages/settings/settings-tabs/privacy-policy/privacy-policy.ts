import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../settings-service';
import { DocumentsPage, DocumentSection } from '../documents-page/documents-page/documents-page';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, DocumentsPage],
  template: `
    <app-documents-page 
      [isLoading]="isLoading()" 
      [sections]="sections()">
    </app-documents-page>
  `,
})
export class PrivacyPolicy implements OnInit {
  private settingsService = inject(SettingsService);

  isLoading = signal(false);
  sections = signal<DocumentSection[]>([]);

  ngOnInit() {
    this.loadPrivacyData();
  }

private loadPrivacyData() {
    this.isLoading.set(true);

    this.settingsService.getPrivacyPolicy().subscribe({
      next: (data: DocumentSection[]) => {
        this.sections.set(data);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}