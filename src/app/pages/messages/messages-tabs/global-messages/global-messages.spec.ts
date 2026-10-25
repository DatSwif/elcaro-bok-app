import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMessages } from './global-messages';

describe('GlobalMessages', () => {
  let component: GlobalMessages;
  let fixture: ComponentFixture<GlobalMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalMessages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
