import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalMessageDto {
  id: number;
  title: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
}

export interface PersonalMessageDto {
  id: number;
  title: string;
  level: number;
  is_read: boolean;
  read_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  private getStandardOptions() {
    return {
      params: new HttpParams().set('format', 'json'),
    };
  }

  getGlobalMessages(): Observable<GlobalMessageDto[]> {
    return this.http.get<GlobalMessageDto[]>(
      `${this.apiUrl}/messages/global`,
      this.getStandardOptions()
    );
  }

  markGlobalMessageAsRead(id: number): Observable<GlobalMessageDto> {
    return this.http.put<GlobalMessageDto>(
        `${this.apiUrl}/messages/global/${id}`,
        null,
        this.getStandardOptions()
    );
  }

  deleteGlobalMessage(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/messages/global/${id}`,
      this.getStandardOptions()
    );
  }

  getPersonalMessages(): Observable<PersonalMessageDto[]> {
    return this.http.get<PersonalMessageDto[]>(
      `${this.apiUrl}/messages/personal`,
      this.getStandardOptions()
    );
  }

  markPersonalMessageAsRead(id: number): Observable<PersonalMessageDto> {
    return this.http.put<PersonalMessageDto>(
        `${this.apiUrl}/messages/personal/${id}`,
        null,
        this.getStandardOptions()
    );
  }

  deletePersonalMessage(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/messages/personal/${id}`,
      this.getStandardOptions()
    );
  }
}