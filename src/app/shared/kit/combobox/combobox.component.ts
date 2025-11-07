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
  NgpCombobox,
  NgpComboboxButton,
  NgpComboboxDropdown,
  NgpComboboxInput,
  NgpComboboxOption,
  NgpComboboxPortal,
} from 'ng-primitives/combobox';
import { NgpOption, NgpOptionGroup } from '../models/ngp-option.model';
import { NgpKitDataService } from '../data/kit-data.service';

type NgpComboboxDataset = 'countries' | 'timezones';

@Component({
  selector: 'ngp-combobox',
  standalone: true,
  imports: [
    CommonModule,
    NgpCombobox,
    NgpComboboxDropdown,
    NgpComboboxOption,
    NgpComboboxInput,
    NgpComboboxPortal,
    NgpComboboxButton,
  ],
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpComboboxComponent,
    },
  ],
})
export class NgpComboboxComponent<T = unknown> implements ControlValueAccessor {
  private readonly kitData = inject(NgpKitDataService);

  readonly placeholder = input<string>('Начните вводить...');
  readonly clearable = input(true, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  readonly compareWithInput = input<(a: T | null, b: T | null) => boolean>(
    (a, b) => a === b,
    { alias: 'compareWith' },
  );
  readonly dataset = input<NgpComboboxDataset | undefined>(undefined);
  readonly optionsInput = input<NgpOption<T>[] | null>(null, { alias: 'options' });
  readonly optionGroupsInput = input<NgpOptionGroup<T>[] | null>(null, { alias: 'optionGroups' });

  readonly valueChange = output<T | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  private readonly internalValue = signal<T | null>(null);
  private readonly openState = signal(false);
  private readonly searchTerm = signal('');
  private readonly selectedOption = signal<NgpOption<T> | null>(null);
  private readonly options = signal<NgpOption<T>[]>([]);
  private readonly groups = signal<NgpOptionGroup<T>[]>([]);
  private readonly cvaDisabled = signal(false);

  readonly value = this.internalValue;
  readonly isDisabled = computed(() => this.disabledInput() || this.cvaDisabled());
  readonly hasGroups = computed(() => this.groups().length > 0);
  readonly compareFn = computed(() => {
    const fn = this.compareWithInput();
    return (a?: T, b?: T) => fn(a ?? null, b ?? null);
  });
  readonly open = computed(() => this.openState());
  readonly currentSelected = computed(() => this.selectedOption());
  readonly inputDisplay = computed(() => {
    if (!this.searchable()) {
      return this.selectedOption()?.label ?? '';
    }
    return this.open() ? this.searchTerm() : this.selectedOption()?.label ?? '';
  });

  readonly filteredOptions = computed(() => {
    if (this.hasGroups()) {
      return [] as NgpOption<T>[];
    }
    const term = this.searchTerm().trim().toLowerCase();
    const options = this.options();
    if (!this.searchable() || !term) {
      return options;
    }
    return options.filter((option) => this.matchesTerm(option, term));
  });

  readonly filteredGroups = computed(() => {
    const groups = this.groups();
    if (!groups.length) {
      return [] as NgpOptionGroup<T>[];
    }
    if (!this.searchable()) {
      return groups;
    }
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return groups;
    }
    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => this.matchesTerm(option, term)),
      }))
      .filter((group) => group.options.length > 0);
  });

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
          this.resetSearchIfNeeded();
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
          this.resetSearchIfNeeded();
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
    this.resetSearchIfNeeded();
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

  onPrimitiveChange(value: T | null): void {
    this.internalValue.set(value);
    this.syncSelection();
    this.resetSearchIfNeeded();
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onOpenChange(isOpen: boolean): void {
    this.openState.set(isOpen);
    if (isOpen) {
      if (this.searchable()) {
        this.searchTerm.set('');
      }
      this.opened.emit();
    } else {
      this.resetSearchIfNeeded();
      this.closed.emit();
    }
  }

  onInput(event: Event): void {
    if (!this.searchable()) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value ?? '');
  }

  onClear(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.searchTerm.set('');
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

  private matchesTerm(option: NgpOption<T>, term: string): boolean {
    const values = [option.label, option.hint ?? ''];
    return values.some((value) => value?.toString().toLowerCase().includes(term));
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

  private resetSearchIfNeeded(): void {
    if (!this.searchable()) {
      return;
    }
    this.searchTerm.set(this.selectedOption()?.label ?? '');
  }

  private resolveDataset(dataset: NgpComboboxDataset): void {
    if (dataset === 'countries') {
      this.groups.set(this.kitData.getCountryOptions() as unknown as NgpOptionGroup<T>[]);
      this.options.set([]);
    } else if (dataset === 'timezones') {
      this.groups.set(this.kitData.getTimezoneGroups() as unknown as NgpOptionGroup<T>[]);
      this.options.set([]);
    }
    this.syncSelection();
    this.resetSearchIfNeeded();
  }
}
