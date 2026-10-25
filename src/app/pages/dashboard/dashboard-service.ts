import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AccountInfo {
  account_number: string;
  balance: number;
}

export interface Message {
  id: number;
  title: string;
  content: string;
}

export interface ServiceItem {
  service_type: string;
  activeCount: number;
}

export interface Offer {
  id: number;
  title: string;
  subtitle: string;
  image_url: string | null;
}

export interface DashboardResponse {
  account: AccountInfo;
  messages: Message[];
  services: ServiceItem[];
  offers: Offer[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  private getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json'),
    };
  }

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      this.apiUrl,
      this.getStandardOptions()
    );
  }
}