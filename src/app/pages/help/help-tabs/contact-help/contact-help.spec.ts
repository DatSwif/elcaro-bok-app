import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactHelp } from './contact-help';

describe('ContactHelp', () => {
  let component: ContactHelp;
  let fixture: ComponentFixture<ContactHelp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactHelp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactHelp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
