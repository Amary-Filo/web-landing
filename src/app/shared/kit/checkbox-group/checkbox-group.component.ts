import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgpCheckbox } from 'ng-primitives/checkbox';
import { NgpOption } from '../models/ngp-option.model';

@Component({
  selector: 'ngp-checkbox-group',
  standalone: true,
  imports: [CommonModule, NgpCheckbox],
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpCheckboxGroupComponent,
    },
  ],
})
export class NgpCheckboxGroupComponent<T = unknown> implements ControlValueAccessor {
  readonly legend = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly layout = input<'horizontal' | 'vertical'>('vertical');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly compareWithInput = input<(a: T, b: T) => boolean>((a, b) => a === b, {
    alias: 'compareWith',
  });
  readonly optionsInput = input<NgpOption<T>[] | null>(null, { alias: 'options' });

  readonly valueChange = output<T[]>();

  private readonly value = signal<T[]>([]);
  private readonly options = signal<NgpOption<T>[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly values = this.value;
  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly orientation = computed(() => (this.layout() === 'horizontal' ? 'horizontal' : 'vertical'));

  constructor() {
    effect(
      () => {
        const opts = this.optionsInput();
        if (opts) {
          this.options.set(opts);
          this.syncSelection();
        }
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      this.compareWithInput();
      this.syncSelection();
    });
  }

  // region ControlValueAccessor
  writeValue(value: T[] | null): void {
    this.value.set(Array.isArray(value) ? [...value] : []);
    this.syncSelection();
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
  // endregion

  private onChange: (value: T[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get optionsList(): NgpOption<T>[] {
    return this.options();
  }

  toggleOption(option: NgpOption<T>): void {
    if (this.isDisabled() || option.disabled) {
      return;
    }
    const compare = this.compareWithInput();
    const current = this.value();
    const exists = current.some((item) => compare(item, option.value));
    const next = exists
      ? current.filter((item) => !compare(item, option.value))
      : [...current, option.value];
    this.value.set(next);
    this.onChange(next);
    this.valueChange.emit(next);
  }

  isChecked(option: NgpOption<T>): boolean {
    const compare = this.compareWithInput();
    return this.value().some((item) => compare(item, option.value));
  }

  handleBlur(): void {
    this.onTouched();
  }

  trackOption(_: number, option: NgpOption<T>): string | number {
    return typeof option.value === 'string' || typeof option.value === 'number'
      ? option.value
      : option.label;
  }

  private syncSelection(): void {
    const compare = this.compareWithInput();
    const filtered = this.value().filter((item) =>
      this.options().some((option) => compare(item, option.value)),
    );
    if (filtered.length !== this.value().length) {
      this.value.set(filtered);
    }
  }
}
