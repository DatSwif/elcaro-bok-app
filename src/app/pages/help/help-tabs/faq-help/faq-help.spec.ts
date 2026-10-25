import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqHelp } from './faq-help';

describe('FaqHelp', () => {
  let component: FaqHelp;
  let fixture: ComponentFixture<FaqHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqHelp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
