import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingConsents } from './marketing-consents';

describe('MarketingConsents', () => {
  let component: MarketingConsents;
  let fixture: ComponentFixture<MarketingConsents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingConsents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingConsents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
