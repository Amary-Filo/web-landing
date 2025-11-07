import { Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { injectRadioGroupState, NgpRadioGroup } from 'ng-primitives/radio';
import { ChangeFn, provideValueAccessor, TouchedFn } from 'ng-primitives/utils';

@Component({
  selector: 'app-radio-group',
  hostDirectives: [
    {
      directive: NgpRadioGroup,
      inputs: [
        'ngpRadioGroupValue:value',
        'ngpRadioGroupDisabled:disabled',
        'ngpRadioGroupOrientation:orientation',
      ],
      outputs: ['ngpRadioGroupValueChange:valueChange'],
    },
  ],
  providers: [provideValueAccessor(RadioGroupComponent)],
  template: ` <ng-content /> `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 42px;
      border: 1px solid #29293F;
      border-radius: 10px;
      overflow: hidden;
    }
  `,
  host: {
    '(focusout)': 'onTouched?.()',
  },
})
export class RadioGroupComponent implements ControlValueAccessor {
  /** Access the radio group state */
  protected readonly state = injectRadioGroupState<string>();

  /** The on change callback */
  private onChange?: ChangeFn<string | null>;

  /** The on touched callback */
  protected onTouched?: TouchedFn;

  constructor() {
    this.state().valueChange.subscribe((value) => this.onChange?.(value));
  }

  /** Write a new value to the radio group */
  writeValue(value: string): void {
    this.state().value.set(value);
  }

  /** Register the on change callback */
  registerOnChange(onChange: ChangeFn<string | null>): void {
    this.onChange = onChange;
  }

  /** Register the on touched callback */
  registerOnTouched(onTouched: TouchedFn): void {
    this.onTouched = onTouched;
  }
}
