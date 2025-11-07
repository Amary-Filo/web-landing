import { ChangeDetectionStrategy, Component, inject, input, output, OnInit } from '@angular/core';
import { FlickerDirective } from '../../directives/flicker.directive';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../lib/input.component';
import { TextareaComponent } from '../../lib/textarea.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { RadioGroupComponent } from '../../lib/radio/radio-group.component';
import { RadioItemComponent } from '../../lib/radio/radio-item.component';
import { TTiers } from 'src/app/pages/main/components';
import { ComboboxComponent } from '../../lib/combobox.component';
import { COUNTRIES_LIST } from '../../lib/data/combobox-data';
import { DataCollectorService } from 'src/app/core/services/data-collector.service';
import { OrderFormControls, TContactType } from 'src/app/core/interfaces/form.interfaces';
import { contactByTypeValidator, contactGroupValidator } from 'src/app/core/utils/form.validators';

@Component({
  selector: 'ui-form-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FlickerDirective,
    CommonModule,
    InputComponent,
    TextareaComponent,
    RadioGroupComponent,
    RadioItemComponent,
    ComboboxComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiFormOrderComponent implements OnInit {
  color = input<string>('#fe70a1');
  gradient = input<string>('pink-1');
  price = input<string>('10000');
  estimate = input<string>('4+');
  tier = input<TTiers>('start');
  isSend = input<boolean>(false);
  btnClick = output<void>();

  private dataCollector = inject(DataCollectorService);
  private http = inject(HttpClient);

  countries = COUNTRIES_LIST;
  isSubmitting = false;

  form = new FormGroup<OrderFormControls>(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      type: new FormControl<TContactType>('telegram', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      contact: new FormControl<string | null>(null, {
        validators: [Validators.required, contactByTypeValidator()],
      }),
      country: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      text: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      tier: new FormControl<TTiers>(this.tier(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      price: new FormControl(this.price(), {
        nonNullable: true,
        validators: [Validators.required],
      }),
      estimate: new FormControl(this.estimate(), {
        nonNullable: true,
        validators: [Validators.required],
      }),

      meta: this.dataCollector.getMetaFormGroup(),
    } as any,
    { validators: [contactGroupValidator] } as any
  );

  ngOnInit(): void {
    console.log('✅ Form initialized with meta data');
    this.dataCollector.debugLog();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.error('❌ Form is invalid');
      return;
    }

    this.isSubmitting = true;
    const formData = this.form.getRawValue();

    console.log('✅ Submitting order:', formData);

    this.http.post('/api/orders', formData).subscribe({
      next: (response) => {
        console.log('✅ Order submitted successfully', response);
        this.isSubmitting = false;
        this.form.reset();
        this.btnClick.emit();
      },
      error: (error) => {
        console.error('❌ Error submitting order', error);
        this.isSubmitting = false;
      },
    });
  }

  debugData(): void {
    this.dataCollector.debugLog();
    console.log('Full Form Data:', this.form.getRawValue());
  }
}
