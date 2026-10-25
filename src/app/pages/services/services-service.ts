import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private apiUrl = '/api/services';
  
  constructor(private http : HttpClient) {}
  
  getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json')
    };
  }

  getAddresses() : Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/addresses`, this.getStandardOptions());
  }

  getServices() : Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getStandardOptions());
  }

  getServiceDetails(userServiceId : number) : Observable<any> {
    const options = {
      params: new HttpParams()
        .set('format', 'json')
        .set('user_service_id', userServiceId.toString()) 
    };
    return this.http.get<any>(`${this.apiUrl}/${userServiceId}`, options);
  }

  getClientPhoneNumbers(): Observable<string[]> {
    return this.http.get<string[]>('/api/clients/phone-numbers');
  }

  postInitAddPackage(userServiceId: number, packageId: number, phoneNumber: string) : Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/${userServiceId}/packages/${packageId}/init`, { phoneNumber: phoneNumber });
  }

  postVerifyAddPackage(userServiceId: number, packageId: number, phoneNumber: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userServiceId}/packages/${packageId}/verify`, { phoneNumber: phoneNumber, code: otp });
  }

  deletePackage(userServiceId: number, packageId: number) : Observable<void> {
    const options = {
      params: new HttpParams()
        .set('format', 'json')
        .set('user_service_id', userServiceId.toString()) 
        .set('package_id', packageId.toString())
    };
    const url = `${this.apiUrl}/${userServiceId}/packages/${packageId}`;
    return this.http.delete<void>(url, options);
  }
}