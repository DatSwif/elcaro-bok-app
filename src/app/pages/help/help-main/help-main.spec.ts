import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMain } from './help-main';

describe('HelpMain', () => {
  let component: HelpMain;
  let fixture: ComponentFixture<HelpMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
