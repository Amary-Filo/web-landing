import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { InputComponent } from '../../lib/input.component';
import { TextareaComponent } from '../../lib/textarea.component';
import { BaseFormControls, TFormType } from 'src/app/core/interfaces/form.interfaces';
import { DataCollectorService } from 'src/app/core/services/data-collector.service';
import { UIIconComponent } from '../../components/icon/icon.component';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
  selector: 'ui-form-question',
  standalone: true,
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    UIIconComponent,
  ],
})
export class UiFormQuestionComponent {
  private scroll = inject(ScrollService);

  private dataCollector = inject(DataCollectorService);
  private http = inject(HttpClient);
  private endpoint = 'http://127.0.0.1:54321/functions/v1/contact';
  // private endpoint = 'https://uyykrwzmbcgepwdwpyst.functions.supabase.co/contact';

  readonly isSubmitting = signal<boolean>(false);
  readonly formSent = signal<boolean>(false);

  form = new FormGroup<BaseFormControls>({
    type: new FormControl<TFormType>('question', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    contact: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.email],
    }),
    message: new FormControl<string | null>(null, {
      validators: [Validators.required, Validators.maxLength(2000)],
    }),
    meta: this.dataCollector.getMetaFormGroup(),
  } as any);

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const formData = this.form.getRawValue();

    this.http.post(this.endpoint, formData).subscribe({
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

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
