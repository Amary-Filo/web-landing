import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgpToggle } from 'ng-primitives/toggle';
import { NgpButton } from 'ng-primitives/button';

@Component({
  selector: 'ngp-toggle',
  standalone: true,
  imports: [CommonModule, NgpToggle, NgpButton],
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpToggleComponent,
    },
  ],
})
export class NgpToggleComponent implements ControlValueAccessor {
  readonly label = input<string | undefined>(undefined);
  readonly activeLabel = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);
  readonly appearance = input<'soft' | 'solid' | 'outline'>('soft');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly valueChange = output<boolean>();

  private readonly value = signal(false);
  private readonly cvaDisabled = signal(false);

  readonly currentValue = this.value;
  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly displayLabel = computed(() => (this.value() ? this.activeLabel() ?? this.label() : this.label()));

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  // region ControlValueAccessor
  writeValue(value: boolean | null): void {
    this.value.set(Boolean(value));
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
  // endregion

  onPrimitiveChange(selected: boolean): void {
    this.value.set(selected);
    this.onChange(selected);
    this.valueChange.emit(selected);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
