import { Component, inject, input, signal } from '@angular/core';
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

import { RadioGroupComponent } from '../../lib/radio/radio-group.component';
import { RadioItemComponent } from '../../lib/radio/radio-item.component';
import { TTiers } from 'src/app/pages/main/components';
import { ComboboxComponent } from '../../lib/combobox.component';
import { COUNTRIES_LIST } from '../../lib/data/combobox-data';
import { DataCollectorService } from 'src/app/core/services/data-collector.service';
import {
  OrderFormControls,
  TContactType,
  TFormType,
} from 'src/app/core/interfaces/form.interfaces';
import { contactByTypeValidator, contactGroupValidator } from 'src/app/core/utils/form.validators';
import { UIIconComponent } from '../../components/icon/icon.component';
import { ContactRequestService } from 'src/app/core/services/contact-request.service';

@Component({
  selector: 'ui-form-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    RadioGroupComponent,
    RadioItemComponent,
    ComboboxComponent,
    UIIconComponent,
  ],
})
export class UiFormOrderComponent {
  color = input<string>('#fe70a1');
  gradient = input<string>('pink-1');
  price = input<string>('10000');
  estimate = input<string>('4+');
  tier = input<TTiers>('start');
  isSend = input<boolean>(false);

  private dataCollector = inject(DataCollectorService);
  private contactRequest = inject(ContactRequestService);

  readonly countries = COUNTRIES_LIST;
  readonly isSubmitting = signal<boolean>(false);
  readonly formSent = signal<boolean>(false);

  form = new FormGroup<OrderFormControls>(
    {
      type: new FormControl<TFormType>('brief', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      formatContact: new FormControl<TContactType>('telegram', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      contact: new FormControl<string | null>(null, {
        validators: [Validators.required, contactByTypeValidator()],
      }),
      message: new FormControl<string | null>(null, {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(2000)],
      }),
      country: new FormControl<string | null>(null, {
        nonNullable: true,
        validators: [Validators.required],
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

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.form.getRawValue();

    this.contactRequest.submitBrief(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.formSent.set(true);
      },
      error: (error) => {
        console.error(error);
        this.isSubmitting.set(false);
        this.formSent.set(false);
      },
    });
  }
}
