import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageUtilsService } from '../shared/language-utils-service';

export interface LayoutData {
  firstName: string;
  lastName: string;
  messageCount: number;
  appLanguage: string;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  langUtils = inject(LanguageUtilsService);
  
  firstName = signal('');
  lastName = signal('');
  messageCount = signal(0);
  isLoading = signal(false);
  
  checkLoading: boolean = false; // Uncheck this to disable loading overlay.

  private apiUrl = '/api/layout';

  constructor(private http: HttpClient) {}

  loadLayoutData(): void {
    this.isLoading.set(true);
    this.getLayoutData().subscribe({
      next: (data) => {
        this.firstName.set(data.firstName);
        this.lastName.set(data.lastName);
        this.messageCount.set(data.messageCount);

        this.langUtils.syncWithLayoutApi(data.appLanguage);
      },
      error: (err) => {
        console.error('Failed to load layout data', err);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  private getLayoutData(): Observable<LayoutData> {
    return this.http.get<LayoutData>(this.apiUrl);
  }
}
