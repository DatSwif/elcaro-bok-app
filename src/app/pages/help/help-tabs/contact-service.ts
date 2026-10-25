import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface ContactSchedule {
  days: string;
  hours: string;
}

export interface ContactApiResponse {
  phone: {
    number: string;
    schedule: ContactSchedule;
  };
  email: {
    address: string;
    schedule: ContactSchedule;
  };
}

export interface ContactHelpBox {
  id: string;
  type: 'phone' | 'email';
  icon: string;
  alt: string;
  title: string;
  value: string;
  schedule: string;
  href: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contact-help';

  getContactBoxes(): Observable<ContactHelpBox[]> {
    return this.http.get<ContactApiResponse>(this.baseUrl).pipe(
      map((data) => [
        {
          id: '1',
          type: 'phone',
          icon: 'assets/icons/fi-rr-call-outgoing.svg',
          alt: $localize`:@@phoneAlt:Phone`,
          title: $localize`:@@callHotlineTitle:Zadzwoń na infolinię`,
          value: `tel. ${data.phone.number}`,
          schedule: this.formatSchedule(data.phone.schedule),
          href: `tel:${data.phone.number.replace(/\s+/g, '')}`,
        },
        {
          id: '2',
          type: 'email',
          icon: 'assets/icons/fi-rr-envelope-plus.svg',
          alt: $localize`:@@emailAlt:Email`,
          title: $localize`:@@sendMessageTitle:Wyślij wiadomość`,
          value: data.email.address,
          schedule: this.formatSchedule(data.email.schedule),
          href: `mailto:${data.email.address}`,
        },
      ])
    );
  }

  private formatSchedule(schedule: ContactSchedule): string {
    return `${schedule.days} ${schedule.hours}`;
  }
}