import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectModule } from 'primeng/select';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-phone-input',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputMaskModule,
    FloatLabelModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInput),
      multi: true
    }
  ],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.css',
})
export class PhoneInput {
   @Input() invalid = false;

  countries = [
    { name: $localize`:@@country.germany:Niemcy`, code: 'DE', prefix: '+49' },
    { name: $localize`:@@country.poland:Polska`, code: 'PL', prefix: '+48' },
    { name: $localize`:@@country.ukraine:Ukraina`, code: 'UA', prefix: '+380' },
    { name: $localize`:@@country.usa:Stany Zjednoczone`, code: 'US', prefix: '+1' }
  ];

  internalForm = new FormGroup({
    countryData: new FormControl(this.countries[0]),
    phone: new FormControl('', [Validators.required])
  });

  private destroy$ = new Subject<void>();
  onTouched = () => {};

  constructor() {
    this.internalForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const fullNumber = (value.countryData?.prefix || '') + (value.phone || '');
        this.onChange(fullNumber);
      });
  }

  snapToCorrectPosition(event : any) {
    const input = event.target || event.originalEvent?.target;
    if (!input) return;

    // We use a tiny timeout to let the browser finish its default click behavior 
    // before we override the cursor position.
    setTimeout(() => {
    const value = input.value;
    // Find the index of the first empty space or the end of the numbers
    // This regex finds the first position that isn't a digit and isn't a space 
    // (since slotChar is empty, it looks for the end of the string)
    const firstEmptyIndex = value.search(/[^0-9 ]/); 
    
    // If the mask is partially filled, find where the digits end
    const lastDigitIndex = value.trimEnd().length;

    input.setSelectionRange(lastDigitIndex, lastDigitIndex);
  }, 0);
  }

  onChange = (value: string) => {};

  writeValue(value: string): void {
    if (!value) return;
    const country = this.countries.find(c => value.startsWith(c.prefix));
    const phone = country ? value.replace(country.prefix, '') : value;
    
    this.internalForm.patchValue({ countryData: country, phone }, { emitEvent: false });
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
