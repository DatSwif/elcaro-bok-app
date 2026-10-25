import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContactService } from '../contact-service';

@Component({
  selector: 'app-contact-help',
  standalone: true,
  imports: [],
  templateUrl: './contact-help.html',
  styleUrl: './contact-help.css',
})
export class ContactHelp {
  private readonly contactService = inject(ContactService);

  private readonly contactBoxes = toSignal(this.contactService.getContactBoxes(), {
    initialValue: [],
  });

  readonly phoneBox = computed(() =>
    this.contactBoxes().find((box) => box.type === 'phone')
  );

  readonly emailBox = computed(() =>
    this.contactBoxes().find((box) => box.type === 'email')
  );
}