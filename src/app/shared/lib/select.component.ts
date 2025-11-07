import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, input, model, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import { ChangeFn, provideValueAccessor, TouchedFn } from 'ng-primitives/utils';
import { UIIconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'app-select',
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal, UIIconComponent],
  providers: [provideValueAccessor(SelectComponent)],
  template: `
    <div
      [(ngpSelectValue)]="value"
      [ngpSelectDisabled]="disabled() || formDisabled()"
      (ngpSelectValueChange)="onValueChange($event)"
      ngpSelect
    >
      @if (value(); as value) {
      <span class="select-value">{{ value }}</span>
      } @else {
      <span class="select-placeholder">{{ placeholder() }}</span>
      } @if(arrow()) {
      <div class="arrow">
        <ui-icon name="coinFill" size="10px" />
      </div>
      }

      <div *ngpSelectPortal ngpSelectDropdown>
        @for (option of options(); track option) {
        <div [ngpSelectOptionValue]="option" ngpSelectOption>
          {{ option }}
        </div>
        } @empty {
        <div class="empty-message">No options found</div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      max-width: var(--kit-select-max-width);
      width: 100%;
    }

    :host.ng-invalid.ng-touched [ngpSelect] {
      outline: 2px solid #ff4d4f;
      outline-offset: 2px;
    }

    [ngpSelect] {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      max-width: var(--kit-select-max-width);
      width: 100%;

      padding: 10px 10px 10px 20px;

      border-radius: 10px;
      border: none;
      background-color: #29293F;
      box-sizing: border-box;
    }

    .select-placeholder {
      color: #808095;
    }

    .arrow {
      padding: 6px;
      background-color: #1D1D31;
      border-radius: 5px;
      color: rgba(var(--cl-main-rgb, #4d4d74), 1);
      
      ui-icon {
        transition: .3s ease-in-out;
      }
    }

    [ngpSelect][data-open] {
      ui-icon {
        transition: .3s ease-in-out;
        transform: rotate(180deg);
      }
    }

    [ngpSelect][data-focus] {
      outline: 2px solid rgba(var(--cl-main-rgb, #4d4d74), 0.6);
      outline-offset: 2px;
    }

    .select-value,
    .select-placeholder {
      font-weight: 600;
      font-size: 14px;
      color: #808095;
    }

    .select-value {
      color: white;
    }

    [ngpSelectDropdown] {
      position: absolute;

      width: var(--ngp-select-width);
      max-height: 240px;

      padding: 7px;
      margin-top: 4px;

      border: 1px solid var(--ngp-border);
      border-radius: 10px;
      box-shadow: var(--ngp-shadow-lg);
      background-color: #29293F;

      animation: popover-show 0.1s ease-out;
      transform-origin: var(--ngp-select-transform-origin);
      box-sizing: border-box;

      overflow-y: auto;
      outline: none;
      z-index: 999;
    }

    [ngpSelectDropdown][data-enter] {
      animation: select-show 0.1s ease-out;
    }

    [ngpSelectDropdown][data-exit] {
      animation: select-hide 0.1s ease-out;
    }

    [ngpSelectOption] {
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
      transition: .3s ease-in-out;
    }

    [ngpSelectOption][data-hover] {
      background-color: #3e3e5d;
    }

    [ngpSelectOption][data-press] {
      background-color: #3e3e5d;
    }

    [ngpSelectOption][data-active] {
      background-color: #3e3e5d;
    }

    .empty-message {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem;
      color: var(--ngp-text-secondary);
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    }

    @keyframes select-show {
      0% {
        opacity: 0;
        transform: translateY(-10px) scale(0.9);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes select-hide {
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
})
export class SelectComponent implements ControlValueAccessor {
  readonly options = input<string[]>([]);
  readonly arrow = input<boolean>(true);
  readonly placeholder = input<string>('');

  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The selected value. */
  readonly value = model<string | undefined>();

  /** Store the form disabled state */
  protected readonly formDisabled = signal(false);

  /** The on change callback */
  private onChange?: ChangeFn<string>;

  /** The on touch callback */
  protected onTouched?: TouchedFn;

  writeValue(value: string | undefined): void {
    this.value.set(value);
  }

  registerOnChange(fn: ChangeFn<string | undefined>): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onValueChange(value: string): void {
    this.onChange?.(value);
  }
}
