import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingReturns } from './billing-returns';

describe('BillingReturns', () => {
  let component: BillingReturns;
  let fixture: ComponentFixture<BillingReturns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingReturns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingReturns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
