import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HardwareItem } from './hardware-item';

describe('HardwareItem', () => {
  let component: HardwareItem;
  let fixture: ComponentFixture<HardwareItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwareItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwareItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
