import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface ErrorData {
  title: string;
  message: string;
  type: "error" | "success" | "info" | "warn" | "secondary" | "contrast" | null | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  messageService = inject(MessageService);

  showError(title: string, message: string, severity : string = 'error') {
    this.messageService.add({ 
      severity: severity, 
      summary: title, 
      detail: message,
      life: 5000
    });
  }
}
