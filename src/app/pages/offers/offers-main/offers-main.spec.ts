import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersMain } from './offers-main';

describe('OffersMain', () => {
  let component: OffersMain;
  let fixture: ComponentFixture<OffersMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
