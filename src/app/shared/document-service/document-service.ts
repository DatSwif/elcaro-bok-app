import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentItem {
  id: string;
  title: string;
  text?: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private apiUrl = '/api';

  isDocumentVisible = false;
  selectedDocument: DocumentItem | null = null;

  constructor(private http: HttpClient) {}

  showDocument(doc: DocumentItem) {
    this.selectedDocument = doc;
    this.isDocumentVisible = true;
  }

  hideDocument() {
    this.selectedDocument = null;
    this.isDocumentVisible = false;
  }

  getDocumentContent(id: string): Observable<{ id: string; text: string }> {
    return this.http.get<{ id: string; text: string }>(
      `${this.apiUrl}/documents/${id}/text`
    );
  }

  getDocumentPdf(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/documents/${id}/pdf`, {
      responseType: 'blob',
    });
  }

  getPromotionRegulations(): Observable<DocumentItem> {
    return this.http.get<DocumentItem>(`${this.apiUrl}/services/promotions-regulations`);
  }
}
