import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingMain } from './billing-main';

describe('BillingMain', () => {
  let component: BillingMain;
  let fixture: ComponentFixture<BillingMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
