import { inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormFactoryResult, FormService, TControlsMap } from 'src/app/core/services/form.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { COUNTRIES_LIST } from '../lib/data/combobox-data';

export abstract class BaseFormModel<T extends TControlsMap<T>> {
  private scroll = inject(ScrollService);
  protected formService = inject(FormService);

  readonly isSubmitting = signal(false);
  readonly formSent = signal(false);

  readonly countries = COUNTRIES_LIST;

  protected abstract formFactory: FormFactoryResult<T>;

  get form(): FormGroup<T> {
    return this.formFactory.form;
  }

  private resetDefaults(): void {
    return this.formFactory.resetDefaults();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.form.getRawValue();

    this.formService.submitForm(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.resetDefaults();
        this.formSent.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.formSent.set(false);
      },
    });
  }

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
