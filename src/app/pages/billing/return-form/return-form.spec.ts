import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnForm } from './return-form';

describe('ReturnForm', () => {
  let component: ReturnForm;
  let fixture: ComponentFixture<ReturnForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
