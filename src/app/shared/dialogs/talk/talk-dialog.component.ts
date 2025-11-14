import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { injectDialogRef, NgpDialog, NgpDialogOverlay } from 'ng-primitives/dialog';
import { UIIconComponent } from '../../components/icon/icon.component';
import { ComboboxComponent } from '../../lib/combobox.component';
import { InputComponent } from '../../lib/input.component';
import { RadioGroupComponent } from '../../lib/radio/radio-group.component';
import { RadioItemComponent } from '../../lib/radio/radio-item.component';
import { TextareaComponent } from '../../lib/textarea.component';
import {
  OrderFormControls,
  TFormType,
  TContactType,
} from 'src/app/core/interfaces/form.interfaces';
import { contactByTypeValidator, contactGroupValidator } from 'src/app/core/utils/form.validators';
import { TTiers } from 'src/app/pages/main/components';
import { COUNTRIES_LIST } from '../../lib/data/combobox-data';
import { DataCollectorService } from 'src/app/core/services/data-collector.service';
import { ContactRequestService } from 'src/app/core/services/contact-request.service';

@Component({
  selector: 'ui-dialog-talk',
  standalone: true,
  imports: [
    NgpDialog,
    NgpDialogOverlay,
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
  templateUrl: './talk-dialog.component.html',
  styleUrl: './talk-dialog.component.scss',
})
export class TalkDialog {
  protected readonly dialogRef = injectDialogRef<string>();
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
      tier: new FormControl<TTiers | null>(null),
      price: new FormControl(null, { nonNullable: true }),
      estimate: new FormControl(null, { nonNullable: true }),

      meta: this.dataCollector.getMetaFormGroup(),
    } as any,
    { validators: [contactGroupValidator] } as any
  );

  close() {
    this.dialogRef.close();
  }

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
