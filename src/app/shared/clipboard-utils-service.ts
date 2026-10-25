import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ClipboardUtilsService {
  messageService = inject(MessageService);

  async copyText(text: string): Promise<boolean> {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        this.messageService.add({
          severity: 'success',
          summary: $localize`:@@clipboard.summary:Schowek`,
          detail: $localize`:@@clipboard.copySuccess:Skopiowano do schowka`,
          life: 5000
        });
        return true;
      } catch (error) {
        console.warn('Clipboard API failed, trying fallback...', error);
      }
    }

    return this.fallbackCopyTextToClipboard(text);
  }

  private fallbackCopyTextToClipboard(text: string): boolean {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: $localize`:@@clipboard.summary:Schowek`,
        detail: $localize`:@@clipboard.copyError:Błąd kopiowania`,
        life: 5000
      });
    }

    document.body.removeChild(textArea);
    if (successful) {
      this.messageService.add({
        severity: 'success',
        summary: $localize`:@@clipboard.summary:Schowek`,
        detail: $localize`:@@clipboard.copySuccess:Skopiowano do schowka`,
        life: 5000
      });
    }
    return successful;
  }
}
