import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfirmation } from './sms-confirmation';

describe('SmsConfirmation', () => {
  let component: SmsConfirmation;
  let fixture: ComponentFixture<SmsConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsConfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
