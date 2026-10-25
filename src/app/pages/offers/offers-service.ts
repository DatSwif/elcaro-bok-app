import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { OfferDetails } from './offer-variants/offer-variants';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private apiUrl = '/api/offers';

  constructor(private http : HttpClient) {}
  
  getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json')
    };
  }

  getOffers() : Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getStandardOptions());
  }

  getVariants(offerId : number) : Observable<OfferDetails> {
    
    if (offerId === 999) {
      return throwError(() => new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        error: 'Offer does not exist'
      }));
    }

    const options = {
      params: new HttpParams()
        .set('format', 'json')
        .set('offer_id', offerId.toString()) 
    };
    return this.http.get<OfferDetails>(`${this.apiUrl}/${offerId}`, this.getStandardOptions());
  }

  getClientPhoneNumbers(): Observable<string[]> {
    return this.http.get<string[]>('/api/clients/phone-numbers');
  }

  postInitAddVariant(offerId : number, variantId : number, phoneNumber: string) : Observable<any[]> {
    return this.http.post<any[]>(`/api/offers/${offerId}/variants/${variantId}/init`, { phoneNumber: phoneNumber });
  }

  postVerifyAddVariant(offerId: number, variantId: number, phoneNumber: string, otp: string): Observable<any> {
    return this.http.post(`/api/offers/${offerId}/variants/${variantId}/verify`, { phoneNumber: phoneNumber, code: otp });
  }
}