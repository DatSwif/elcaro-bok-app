import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalMessages } from './personal-messages';

describe('PersonalMessages', () => {
  let component: PersonalMessages;
  let fixture: ComponentFixture<PersonalMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalMessages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
