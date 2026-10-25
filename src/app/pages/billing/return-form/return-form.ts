import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { BillingService } from '../billing-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-return-form',
  imports: [DrawerModule, ReactiveFormsModule],
  templateUrl: './return-form.html',
  styleUrl: './return-form.css',
})
export class ReturnForm implements OnInit {
  billingService = inject(BillingService);
  private fb = inject(FormBuilder);
  messageService = inject(MessageService);

  maxOverpayment: number = 500;
  
  @Output() close = new EventEmitter<void>();

  visible = true;
  returnForm!: FormGroup;

  ngOnInit() {
    this.returnForm = this.fb.group({
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01), Validators.max(this.maxOverpayment)]],
      account_number: ['', [Validators.required, Validators.minLength(26)]]
    });
  }

  submitForm() {
    if (this.returnForm.valid) {
      this.billingService.postReturn(this.returnForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success!',
            detail: 'Return request submitted',
            life: 5000
          });
        }
      });
      this.visible = false;
    } else {
      this.returnForm.markAllAsTouched();
    }
  }

  onDrawerHidden() {
    this.close.emit();
  }
}
