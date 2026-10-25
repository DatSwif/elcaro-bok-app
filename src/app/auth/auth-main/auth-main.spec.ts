import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMain } from './auth-main';

describe('AuthMain', () => {
  let component: AuthMain;
  let fixture: ComponentFixture<AuthMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthMain);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
