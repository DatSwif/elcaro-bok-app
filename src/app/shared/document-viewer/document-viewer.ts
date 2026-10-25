import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { DocumentItem } from '../document-service/document-service';
import { DocumentService } from '../document-service/document-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [DrawerModule],
  templateUrl: './document-viewer.html',
  styleUrls: ['./document-viewer.css'],
})
export class DocumentViewer {
  @Input() visible: boolean = false;
  @Input() document: DocumentItem | null = null;
  @Input() isLoading: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();

  private documentService = inject(DocumentService);

  async downloadPdf() {
    if (!this.document) {
      return;
    }

    try {
      const blob = await firstValueFrom(this.documentService.getDocumentPdf(this.document.id));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${this.document.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  }
}
