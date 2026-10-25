import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpHeader } from './help-header';

describe('HelpHeader', () => {
  let component: HelpHeader;
  let fixture: ComponentFixture<HelpHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
