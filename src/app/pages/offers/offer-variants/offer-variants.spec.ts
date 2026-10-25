import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferVariants } from './offer-variants';

describe('OfferVariants', () => {
  let component: OfferVariants;
  let fixture: ComponentFixture<OfferVariants>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferVariants]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferVariants);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
