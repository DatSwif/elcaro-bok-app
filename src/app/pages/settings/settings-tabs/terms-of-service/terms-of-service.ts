import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../settings-service';
import { DocumentsPage, DocumentSection } from '../documents-page/documents-page/documents-page';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, DocumentsPage],
  template: `
    <app-documents-page 
      [isLoading]="isLoading()" 
      [sections]="sections()">
    </app-documents-page>
  `,
})
export class TermsOfService implements OnInit {
  private settingsService = inject(SettingsService);

  isLoading = signal(false);
  sections = signal<DocumentSection[]>([]);

  ngOnInit() {
    this.isLoading.set(true);
    this.settingsService.getTermsOfService().subscribe({
      next: (data) => {
        this.sections.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}