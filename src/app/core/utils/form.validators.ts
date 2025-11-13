import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export const contactGroupValidator = (group: AbstractControl): ValidationErrors | null => {
  const type = group.get('formatContact')?.value as 'telegram' | 'email' | undefined;
  const contactCtrl = group.get('contact')!;
  const raw = contactCtrl.value ?? '';
  const v = typeof raw === 'string' ? raw.trim() : '';

  let error: ValidationErrors | null = null;

  if (!v) {
    error = { required: true };
  } else if (type === 'telegram' && !/^@?[a-zA-Z0-9_]{5,}$/.test(v)) {
    error = { contactInvalid: 'telegram' };
  } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    error = { contactInvalid: 'email' };
  }

  const prev = contactCtrl.errors ?? {};
  const next = error ? { ...prev, ...error } : null;
  if (JSON.stringify(prev) !== JSON.stringify(next)) {
    contactCtrl.setErrors(next);
  }

  return null;
};

export const contactByTypeValidator = (): ValidatorFn => {
  return (control) => {
    const parent = control.parent as FormGroup | null;
    const type = parent?.get('formatContact')?.value as 'telegram' | 'email' | undefined;

    const raw = control.value ?? '';
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (!value) return { required: true };

    if (type === 'telegram') {
      return /^@?[a-zA-Z0-9_]{5,}$/.test(value) ? null : { contactInvalid: 'telegram' };
    }

    if (type === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { contactInvalid: 'email' };
    }

    return null;
  };
};
