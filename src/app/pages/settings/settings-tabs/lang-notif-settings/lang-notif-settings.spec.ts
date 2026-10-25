import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangNotifSettings } from './lang-notif-settings';

describe('LangNotifSettings', () => {
  let component: LangNotifSettings;
  let fixture: ComponentFixture<LangNotifSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangNotifSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangNotifSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
