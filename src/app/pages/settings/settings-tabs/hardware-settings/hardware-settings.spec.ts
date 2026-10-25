import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSettings } from './hardware-settings';

describe('HardwareSettings', () => {
  let component: HardwareSettings;
  let fixture: ComponentFixture<HardwareSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwareSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwareSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
