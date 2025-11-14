import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from '@env';
import {
  TOrderFormInit,
  TContactType,
  TCountryValue,
  TFormType,
  IOrderFormControls,
  TBaseFormInit,
  IBaseFormControls,
  TTiers,
} from '@interfaces/form.interfaces';

import { DataCollectorService } from './data-collector.service';
import { contactByTypeValidator, contactGroupValidator } from '@utils/form.validators';

export type TControlsMap<T> = { [K in keyof T]: AbstractControl<any, any> };
export interface FormFactoryResult<TControls extends TControlsMap<TControls>> {
  form: FormGroup<TControls>;
  resetDefaults(): void;
}

@Injectable({ providedIn: 'root' })
export class FormService {
  private http = inject(HttpClient);
  private dataCollector = inject(DataCollectorService);
  private endpoint = environment.contactApiUrl;

  submitForm<T>(payload: Record<string, any>): Observable<T> {
    if (!this.endpoint) return throwError(() => new Error('Form endpoint is not configured'));
    if (payload['country'] && typeof payload['country'] === 'object')
      payload['country'] = payload['country'].value;

    return this.http.post<T>(this.endpoint, payload).pipe(
      retry({
        count: 2,
        delay: (_, retryCount) => timer(retryCount * 300),
      }),
      catchError((error) => {
        console.error('Form submission failed', error);
        return throwError(() => error);
      })
    );
  }

  private markFresh = (form: FormGroup<any>) => {
    form.markAsPristine();
    form.markAsUntouched();
    form.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  };

  createOrderForm(init: TOrderFormInit): FormFactoryResult<IOrderFormControls> {
    const form = new FormGroup<IOrderFormControls>(
      {
        type: new FormControl<TFormType>(init.type, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        name: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        formatContact: new FormControl<TContactType>(init.formatContact, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        contact: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, contactByTypeValidator()],
        }),
        message: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(2000)],
        }),
        country: new FormControl<TCountryValue>(null, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        tier: new FormControl<TTiers | null>(init.tier ?? null),
        price: new FormControl<string | null>(init.price ?? null),
        estimate: new FormControl<string | null>(init.estimate ?? null),
        meta: this.dataCollector.getMetaFormGroup(),
      },
      { validators: [contactGroupValidator] }
    );

    const resetDefaults = () => {
      form.reset({
        type: init.type,
        name: '',
        formatContact: init.formatContact,
        contact: '',
        message: '',
        country: null,
        tier: init.tier ?? null,
        price: init.price ?? null,
        estimate: init.estimate ?? null,
      });
      this.markFresh(form);
    };

    return { form, resetDefaults };
  }

  createQuestionForm(init: TBaseFormInit): FormFactoryResult<IBaseFormControls> {
    const form = new FormGroup<IBaseFormControls>(
      {
        type: new FormControl<TFormType>(init.type, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        name: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(2)],
        }),
        contact: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, contactByTypeValidator()],
        }),
        message: new FormControl<string>('', {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(2000)],
        }),
        meta: this.dataCollector.getMetaFormGroup(),
      },
      { validators: [contactGroupValidator] }
    );

    const resetDefaults = () => {
      form.reset({ type: init.type, name: '', contact: '', message: '' });
      this.markFresh(form);
    };

    return { form, resetDefaults };
  }
}
