import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMain } from './settings-main';

describe('SettingsMain', () => {
  let component: SettingsMain;
  let fixture: ComponentFixture<SettingsMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
