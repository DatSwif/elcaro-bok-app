import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesHeader } from './messages-header';

describe('MessagesHeader', () => {
  let component: MessagesHeader;
  let fixture: ComponentFixture<MessagesHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
