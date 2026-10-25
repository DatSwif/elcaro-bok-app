import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAccountInfo } from './billing-account-info';

describe('BillingAccountInfo', () => {
  let component: BillingAccountInfo;
  let fixture: ComponentFixture<BillingAccountInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingAccountInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingAccountInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
