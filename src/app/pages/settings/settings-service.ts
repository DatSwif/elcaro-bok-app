import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentItem } from '../../shared/document-service/document-service';

export interface ClientProfile {
  id: number;
  clientNumber: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  languageCode: string;
  emails: string[];
  phones: string[];
}

export interface UpdateClientProfileRequest {
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  languageCode?: string;
  emails?: string[];
  phones?: string[];
}

export interface NotificationSettingDto {
  notificationTypeId: number;
  notificationTypeCode: string;
  notificationTypeName: string;
  channel: string;
  enabled: boolean;
}

export interface NotificationSettingsResponse {
  language_code: string;
  notifications: NotificationSettingDto[];
}

export interface UpdateNotificationSettingsRequest {
  language_code: string;
  notifications: NotificationSettingDto[];
}

export interface ConsentDto {
  code: string;
  title: string;
  description: string;
  isGranted: boolean;
  isEditable: boolean;
  grantedAt: string | null;
}

export interface UpdateConsentRequest {
  code: string;
  isGranted: boolean;
}

export interface HardwareItemDto {
  id: number;
  name: string;
  serviceType: string;
  owner: string;
  icon: string;
  serialNumber: string;
  isReturnable: boolean;
  isReportable: boolean;
}

export interface DocumentSection {
  type: string;
  label: string;
  documents: DocumentItem[];
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  private getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json'),
    };
  }

  getProfile(): Observable<ClientProfile> {
    return this.http.get<ClientProfile>(
      `${this.apiUrl}/clients`,
      this.getStandardOptions()
    );
  }

  updateProfile(data: UpdateClientProfileRequest): Observable<ClientProfile> {
    return this.http.put<ClientProfile>(
      `${this.apiUrl}/clients`,
      data,
      this.getStandardOptions()
    );
  }

  getNotificationSettings(): Observable<NotificationSettingsResponse> {
    return this.http.get<NotificationSettingsResponse>(
      `${this.apiUrl}/clients/lang-notification-settings`,
      this.getStandardOptions()
    );
  }

  updateNotificationSettings(
    data: UpdateNotificationSettingsRequest
  ): Observable<NotificationSettingsResponse> {
    return this.http.put<NotificationSettingsResponse>(
      `${this.apiUrl}/clients/lang-notification-settings`,
      data,
      this.getStandardOptions()
    );
  }

  getConsents(): Observable<ConsentDto[]> {
    return this.http.get<ConsentDto[]>(
      `${this.apiUrl}/clients/consents`,
      this.getStandardOptions()
    );
  }

  updateConsents(data: UpdateConsentRequest[]): Observable<ConsentDto[]> {
    return this.http.put<ConsentDto[]>(
      `${this.apiUrl}/clients/consents`,
      data,
      this.getStandardOptions()
    );
  }

  getHardware(): Observable<HardwareItemDto[]> {
    return this.http.get<HardwareItemDto[]>(
      `${this.apiUrl}/hardware`,
      this.getStandardOptions()
    );
  }

  getTermsOfService(): Observable<DocumentSection[]> {
    return this.http.get<DocumentSection[]>(
      `${this.apiUrl}/settings/terms-of-service`,
      this.getStandardOptions()
    );
  }

  getPrivacyPolicy(): Observable<DocumentSection[]> {
    return this.http.get<DocumentSection[]>(
      `${this.apiUrl}/settings/privacy-policy`,
      this.getStandardOptions()
    );
  }

  getDocumentContent(id: string): Observable<{ id: string; text: string }> {
    return this.http.get<{ id: string; text: string }>(
      `${this.apiUrl}/documents/${id}/text`,
      this.getStandardOptions()
    );
  }

  getPDFByID(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}/pdf`, {
      responseType: 'blob',
    });
  }
}