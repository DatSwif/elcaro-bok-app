import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentService } from './document-service';

describe('DocumentService', () => {
  let component: DocumentService;
  let fixture: ComponentFixture<DocumentService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
