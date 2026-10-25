import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  private apiUrl = '/api/billing';

  invoices = signal<any[] | null>(null);

  constructor(private http : HttpClient) {}

  getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json')
    };
  }

  getAccountInfo() : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`, this.getStandardOptions());
  }

  loadInvoices(){
    if (this.invoices() !== null) {
      return; 
    }

    this.http.get<any[]>(`${this.apiUrl}/invoices`, this.getStandardOptions()).subscribe({
      next: (data) => {this.invoices.set(data);},
      error: (error) => console.error('Error fetching invoices:', error)
    });
  }

  getInvoiceDetails(invoiceId: string) : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/invoices/${invoiceId}`, this.getStandardOptions());
  }

  getPayments() : Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments`, this.getStandardOptions());
  }

  getTransferDetails() : Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transfer-details`, this.getStandardOptions());
  }

  postPayment(paymentData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments`, paymentData, this.getStandardOptions());
  }

  getReturns() : Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/returns`, this.getStandardOptions());
  }

  postReturn(returnData: any) : Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/returns`, returnData, this.getStandardOptions());
  }

  getInvoicePdf(invoiceId: number) : Observable<Blob> {
    return this.http.get(`${this.apiUrl}/invoices/${invoiceId}/download`, {
      responseType: 'blob'
    });
  }
}
