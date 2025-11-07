// combobox.component.ts (замени на этот вариант)
import { BooleanInput } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  ContentChild,
  TemplateRef,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  NgpCombobox,
  NgpComboboxButton,
  NgpComboboxDropdown,
  NgpComboboxInput,
  NgpComboboxOption,
  NgpComboboxPortal,
} from 'ng-primitives/combobox';
import { ChangeFn, provideValueAccessor, TouchedFn } from 'ng-primitives/utils';
import { UIIconComponent } from '../components/icon/icon.component';

// БАЗОВЫЙ ТИП: обязательные key/value + любые доп. поля
export type ComboItem = { key: string; value: string } & Record<string, any>;

@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [
    CommonModule,
    NgpCombobox,
    NgpComboboxDropdown,
    NgpComboboxOption,
    NgpComboboxInput,
    NgpComboboxPortal,
    NgpComboboxButton,
    UIIconComponent,
  ],
  providers: [provideValueAccessor(ComboboxComponent)],
  template: `
    <div
      ngpCombobox
      [(ngpComboboxValue)]="value"
      [ngpComboboxDisabled]="disabled() || formDisabled()"
      (ngpComboboxOpenChange)="resetOnClose($event)"
      (ngpComboboxValueChange)="onValueChange($event)"
    >
      <button ngpComboboxButton aria-label="Toggle dropdown">
        @if (valueTpl) {
        <ng-container
          [ngTemplateOutlet]="valueTpl!"
          [ngTemplateOutletContext]="{ $implicit: selectedOption() }"
        ></ng-container>
        } @else {
        <div class="select-placeholder" [class.selected]="!!selectedOption()?.value">
          {{ selectedOption()?.value || placeholder() || 'Select' }}
        </div>
        }
        <div class="arrow">
          <ui-icon name="arrowDownSFill" size="20px" />
        </div>
      </button>

      <div *ngpComboboxPortal ngpComboboxDropdown [class]="color()">
        @if (searchable()) {
        <input
          ngpComboboxInput
          [value]="filter()"
          [placeholder]="placeholder()"
          (input)="onFilterChange($event)"
          (blur)="onTouched?.()"
        />
        }
        <div class="options-list">
          @for (opt of filteredOptions(); track opt.key) {
          <div ngpComboboxOption [ngpComboboxOptionValue]="emitMode() === 'key' ? opt.key : opt">
            @if (optionTpl) {
            <ng-container
              [ngTemplateOutlet]="optionTpl!"
              [ngTemplateOutletContext]="{ $implicit: opt, selected: isSelected(opt) }"
            ></ng-container>
            } @else {
            <!-- Дефолтный вид айтема -->
            <span class="select-placeholder" [class.selected]="!!selectedOption()?.value">{{
              opt.value
            }}</span>
            }
          </div>
          } @empty {
          <div class="empty-message">No data found</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      // :host {
      //   display: block;
      // }

      .selected {
        --ngp-selected: #e6e6f0;
      }

      .arrow {
        height: max-content;
        padding: 1px;
        background-color: #1d1d31;
        border-radius: 5px;
        color: rgba(var(--cl-main-rgb, #4d4d74), 1);

        ui-icon {
          transition: 0.3s ease-in-out;
        }
      }

      [ngpCombobox][data-open] {
        ui-icon {
          transition: 0.3s ease-in-out;
          transform: rotate(180deg);
        }
      }

      [ngpCombobox] {
        display: flex;
        justify-content: space-between;
        align-items: center;

        max-width: var(--kit-select-max-width);
        width: 100%;

        padding: 10px 10px 10px 20px;

        border-radius: 10px;
        border: none;
        background-color: #29293f;
        box-sizing: border-box;
        outline: 2px solid transparent;
        outline-offset: 2px;
        transition: 0.3s ease-in-out;
      }

      [ngpCombobox][data-focus],
      [ngpCombobox][data-open] {
        outline-color: rgba(var(--cl-main-rgb, #4d4d74), 0.6);
      }

      :host.ng-invalid.ng-touched {
        outline-color: #ff4d4f;
      }

      [ngpComboboxInput] {
        width: 100%;
        border: none;
        font-size: 14px;
        background-color: #3b3b5b;
        color: #e6e6f0;
        font-weight: 600;
        outline: none;
        margin-bottom: 10px;
        padding: 7px 10px;
        border-radius: 10px;
      }

      [ngpComboboxButton] {
        display: grid;
        grid-template-columns: 1fr max-content;
        align-items: center;
        width: 100%;
        text-align: left;
        padding: 0;
        border: none;
        color: var(--ngp-text);
        cursor: pointer;
        box-sizing: border-box;
        background-color: transparent;
        outline: none;
        cursor: pointer;
      }

      [ngpComboboxDropdown] {
        position: absolute;
        display: flex;
        flex-direction: column;

        width: var(--ngp-combobox-width);
        max-height: 240px;

        padding: 7px;
        margin-top: 4px;

        // border: 2px solid rgba(var(--cl-main-rgb, rgba(77, 77, 116, 1)), 0.6);
        border: 2px solid rgba(77, 77, 116, 0.5);
        border-radius: 10px;
        box-shadow: var(--ngp-shadow-lg);
        background-color: #29293f;

        animation: popover-show 0.1s ease-out;
        transform-origin: var(--ngp-select-transform-origin);
        box-sizing: border-box;
        box-shadow: 0px 5px 8px 0px #00000036;

        outline: none;
        z-index: 999;
      }

      .options-list {
        height: 100%;
        overflow-y: auto;
        outline: none;
      }

      [ngpComboboxDropdown][data-enter] {
        animation: combobox-show 0.1s ease-out;
      }

      [ngpComboboxDropdown][data-exit] {
        animation: combobox-hide 0.1s ease-out;
      }

      [ngpComboboxOption] {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        height: 36px;
        width: 100%;

        padding: 0.375rem 0.75rem;
        font-size: 14px;

        border-radius: 0.5rem;
        color: #808095;
        box-sizing: border-box;
        cursor: pointer;
        transition: 0.3s ease-in-out;
      }

      [ngpComboboxOption][data-hover],
      [ngpComboboxOption][data-active],
      [ngpComboboxOption][data-press] {
        background: #3e3e5d;
      }

      .lbl {
        font-weight: 600;
        font-size: 14px;
        color: #808095;
      }

      .select-placeholder {
        font-weight: 600;
        font-size: 14px;
        color: var(--ngp-selected, #808095);
      }

      .empty-message {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        color: #a9a9c2;
        font-size: 14px;
      }

      @keyframes combobox-show {
        0% {
          opacity: 0;
          transform: translateY(-10px) scale(0.9);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes combobox-hide {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-10px) scale(0.9);
        }
      }
    `,
  ],
})
export class ComboboxComponent implements ControlValueAccessor {
  // === ПУБЛИЧНЫЕ INPUT'ы ===
  readonly color = input<string>('');
  readonly placeholder = input<string>('');
  readonly options = input<readonly ComboItem[]>([]);
  readonly searchable = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /** Что отдавать в форму: 'key' (по умолчанию) или 'object' */
  readonly emitMode = input<'key' | 'object'>('key');

  /** Кастомный поиск: если передан — заменяет дефолтный */
  readonly searchFn = input<((o: ComboItem, term: string) => boolean) | null>(null);

  /** Текущее значение (key | object) */
  readonly value = model<any | undefined>();

  // === КАСТОМНЫЕ ШАБЛОНЫ (проекция) ===
  @ContentChild('optionTpl', { read: TemplateRef }) optionTpl?: TemplateRef<any>;
  @ContentChild('valueTpl', { read: TemplateRef }) valueTpl?: TemplateRef<any>;

  // === ВНУТРЕННЕЕ СОСТОЯНИЕ ===
  protected readonly filter = signal<string>('');
  protected readonly formDisabled = signal(false);

  // Выбранный объект по текущему value
  protected readonly selectedOption = computed<ComboItem | undefined>(() => {
    const list = this.options();
    const v = this.value();
    if (this.emitMode() === 'key') return list.find((o) => o.key === v);
    return typeof v === 'object' && v ? (v as ComboItem) : undefined;
  });

  // Фильтрованные опции
  protected readonly filteredOptions = computed(() => {
    const list = this.options() ?? [];
    const t = this.filter().toLowerCase().trim();
    const sf = this.searchFn();
    if (!t) return list;
    if (sf) return list.filter((o) => sf(o, t));
    // дефолт: ищем по value и key
    return list.filter((o) => o.value.toLowerCase().includes(t) || o.key.toLowerCase().includes(t));
  });

  // Подсветка выбранного в шаблоне айтема
  protected isSelected = (o: ComboItem) =>
    this.emitMode() === 'key' ? this.value() === o.key : this.value() === o;

  // === CVA ===
  private onChange?: ChangeFn<any | undefined>;
  protected onTouched?: TouchedFn;

  writeValue(val: any | undefined): void {
    this.value.set(val);
    if (this.searchable()) this.filter.set(this.selectedOption()?.value ?? '');
  }
  registerOnChange(fn: ChangeFn<any | undefined>): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: TouchedFn): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onValueChange(val: any): void {
    this.onChange?.(val);
    if (this.searchable()) this.filter.set(this.selectedOption()?.value ?? '');
  }

  onFilterChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.filter.set(input.value ?? '');
  }

  protected resetOnClose(open: boolean): void {
    if (!this.searchable()) return;
    if (open) return;
    if (this.filter() === '') this.value.set(undefined);
    else this.filter.set(this.selectedOption()?.value ?? '');
  }
}
