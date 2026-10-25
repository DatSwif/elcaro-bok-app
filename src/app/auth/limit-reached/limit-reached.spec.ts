import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitReached } from './limit-reached';

describe('LimitReached', () => {
  let component: LimitReached;
  let fixture: ComponentFixture<LimitReached>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitReached]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitReached);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
