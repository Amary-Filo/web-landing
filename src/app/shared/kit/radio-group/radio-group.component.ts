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
import { NgpRadioGroup, NgpRadioIndicator, NgpRadioItem } from 'ng-primitives/radio';
import { NgpOption } from '../models/ngp-option.model';

@Component({
  selector: 'ngp-radio-group',
  standalone: true,
  imports: [CommonModule, NgpRadioGroup, NgpRadioItem, NgpRadioIndicator],
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpRadioGroupComponent,
    },
  ],
})
export class NgpRadioGroupComponent<T = unknown> implements ControlValueAccessor {
  readonly legend = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);
  readonly layout = input<'horizontal' | 'vertical'>('vertical');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly compareWithInput = input<(a: T | null, b: T | null) => boolean>((a, b) => a === b, {
    alias: 'compareWith',
  });
  readonly optionsInput = input<NgpOption<T>[] | null>(null, { alias: 'options' });

  readonly valueChange = output<T | null>();

  private readonly value = signal<T | null>(null);
  private readonly options = signal<NgpOption<T>[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly currentValue = this.value;
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
  writeValue(value: T | null): void {
    this.value.set(value);
    this.syncSelection();
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
  // endregion

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get optionsList(): NgpOption<T>[] {
    return this.options();
  }

  onPrimitiveChange(value: T | null): void {
    this.value.set(value);
    this.syncSelection();
    this.onChange(value);
    this.valueChange.emit(value);
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
    const current = this.value();
    const match = this.options().find((option) => compare(option.value ?? null, current ?? null));
    if (!match && current != null) {
      this.value.set(null);
    }
  }
}
