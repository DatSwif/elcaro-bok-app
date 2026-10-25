import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingInvoices } from './billing-invoices';

describe('BillingInvoices', () => {
  let component: BillingInvoices;
  let fixture: ComponentFixture<BillingInvoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingInvoices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingInvoices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
