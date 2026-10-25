import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqDetailsPage } from './faq-details-page';

describe('FaqDetailsPage', () => {
  let component: FaqDetailsPage;
  let fixture: ComponentFixture<FaqDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqDetailsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
