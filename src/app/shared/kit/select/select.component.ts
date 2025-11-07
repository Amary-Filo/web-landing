import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import { NgpOption, NgpOptionGroup } from '../models/ngp-option.model';
import { NgpKitDataService } from '../data/kit-data.service';

type NgpSelectDataset = 'countries' | 'timezones';

@Component({
  selector: 'ngp-select',
  standalone: true,
  imports: [CommonModule, NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpSelectComponent,
    },
  ],
})
export class NgpSelectComponent<T = unknown> implements ControlValueAccessor {
  private readonly kitData = inject(NgpKitDataService);

  readonly placeholder = input<string>('Выберите значение');
  readonly clearable = input(false, { transform: booleanAttribute });
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly compareWithInput = input<(a: T | null, b: T | null) => boolean>(
    (a, b) => a === b,
    { alias: 'compareWith' },
  );
  readonly dataset = input<NgpSelectDataset | undefined>(undefined);
  readonly optionsInput = input<NgpOption<T>[] | null>(null, { alias: 'options' });
  readonly optionGroupsInput = input<NgpOptionGroup<T>[] | null>(null, { alias: 'optionGroups' });
  readonly panelMaxHeight = input('var(--select-panel-max-height)');

  readonly valueChange = output<T | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly internalValue = signal<T | null>(null);
  private readonly openState = signal(false);
  private readonly selectedOption = signal<NgpOption<T> | null>(null);
  private readonly options = signal<NgpOption<T>[]>([]);
  private readonly groups = signal<NgpOptionGroup<T>[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly hasGroups = computed(() => this.groups().length > 0);
  readonly compareFn = computed(() => {
    const fn = this.compareWithInput();
    return (a?: T, b?: T) => fn(a ?? null, b ?? null);
  });
  readonly value = this.internalValue;

  constructor() {
    effect(
      () => {
        const dataset = this.dataset();
        if (dataset) {
          this.resolveDataset(dataset);
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const opts = this.optionsInput();
        if (opts) {
          this.options.set(opts);
          this.groups.set([]);
          this.syncSelection();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const groups = this.optionGroupsInput();
        if (groups) {
          this.groups.set(groups);
          this.options.set([]);
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
    this.internalValue.set(value);
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

  readonly open = computed(() => this.openState());
  readonly currentSelected = computed(() => this.selectedOption());
  readonly flatOptions = computed(() => this.options());
  readonly groupedOptions = computed(() => this.groups());

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  onPrimitiveChange(value: T | null): void {
    this.internalValue.set(value);
    this.syncSelection();
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onOpenChange(isOpen: boolean): void {
    this.openState.set(isOpen);
    (isOpen ? this.opened : this.closed).emit();
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.onPrimitiveChange(null);
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
    const value = this.internalValue();
    if (value == null) {
      this.selectedOption.set(null);
      return;
    }

    const comparator = this.compareWithInput();
    const list = this.hasGroups()
      ? this.groups().flatMap((group) => group.options)
      : this.options();
    const match = list.find((option) => comparator(option.value ?? null, value ?? null)) ?? null;
    this.selectedOption.set(match);
  }

  private resolveDataset(dataset: NgpSelectDataset): void {
    if (dataset === 'countries') {
      this.groups.set(this.kitData.getCountryOptions() as unknown as NgpOptionGroup<T>[]);
      this.options.set([]);
    } else if (dataset === 'timezones') {
      this.groups.set(this.kitData.getTimezoneGroups() as unknown as NgpOptionGroup<T>[]);
      this.options.set([]);
    }
    this.syncSelection();
  }
}
