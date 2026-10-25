import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { DocumentService, DocumentItem } from '../../../../../shared/document-service/document-service';
import { DocumentViewer } from '../../../../../shared/document-viewer/document-viewer';
import { firstValueFrom } from 'rxjs';

export interface DocumentSection {
  type: string;
  label: string;
  documents: DocumentItem[];
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, DocumentViewer],
  templateUrl: './documents-page.html',
  styleUrls: ['./documents-page.css'],
})
export class DocumentsPage {
  @Input() isLoading = false;
  @Input() sections: DocumentSection[] = [];
  
  private documentService = inject(DocumentService);

  isDocumentVisible = signal(false);
  selectedDocument = signal<DocumentItem | null>(null);
  isLoadingContent = signal(false);

  async showDocument(doc: DocumentItem) {
    this.selectedDocument.set(doc);
    this.isDocumentVisible.set(true);

    if (!doc.text) {
      this.isLoadingContent.set(true);
      try {
        const data = await firstValueFrom(this.documentService.getDocumentContent(doc.id));
        this.selectedDocument.update(current => current ? { ...current, text: data.text } : null);
      } catch (err) {
        console.error('Error loading document:', err);
      } finally {
        this.isLoadingContent.set(false);
      }
    }
  }

  hideDocument() {
    this.isDocumentVisible.set(false);
    this.selectedDocument.set(null);
  }

  onVisibleChange(visible: boolean) {
    this.isDocumentVisible.set(visible);
    if (!visible) {
      this.selectedDocument.set(null);
    }
  }
}