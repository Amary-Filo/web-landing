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
import { NgpSwitch, NgpSwitchThumb } from 'ng-primitives/switch';

@Component({
  selector: 'ngp-switch',
  standalone: true,
  imports: [CommonModule, NgpSwitch, NgpSwitchThumb],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpSwitchComponent,
    },
  ],
})
export class NgpSwitchComponent implements ControlValueAccessor {
  readonly checkedLabel = input<string | undefined>(undefined);
  readonly uncheckedLabel = input<string | undefined>(undefined);
  readonly appearance = input<'primary' | 'success' | 'danger'>('primary');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  readonly valueChange = output<boolean>();

  private readonly value = signal(false);
  private readonly cvaDisabled = signal(false);

  readonly currentValue = this.value;
  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly label = computed(() => (this.value() ? this.checkedLabel() : this.uncheckedLabel()));

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

  onPrimitiveChange(checked: boolean): void {
    this.value.set(checked);
    this.onChange(checked);
    this.valueChange.emit(checked);
  }

  handleBlur(): void {
    this.onTouched();
  }
}
