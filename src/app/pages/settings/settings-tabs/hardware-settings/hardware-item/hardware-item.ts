import { Component, Input } from '@angular/core';
import { HardwareItemDto } from '../../../settings-service';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-hardware-item',
  imports: [DrawerModule],
  templateUrl: './hardware-item.html',
  styleUrl: './hardware-item.css',
})
export class HardwareItem {
  @Input({ required: true }) item!: HardwareItemDto;
  @Input() serviceLabel = '';
  @Input() ownerLabel = '';

  @Input() drawerVisible: boolean = false;
}