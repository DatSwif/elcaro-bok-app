import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesMain } from './services-main';

describe('ServicesMain', () => {
  let component: ServicesMain;
  let fixture: ComponentFixture<ServicesMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
