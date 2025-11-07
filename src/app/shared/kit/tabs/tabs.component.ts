import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  contentChildren,
  effect,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgpTabButton, NgpTabList, NgpTabPanel, NgpTabset } from 'ng-primitives/tabs';
import { NgpTabDirective } from './tab.directive';

interface InternalTab {
  value: string;
  label: string;
  badge?: string;
  icon?: string;
  disabled: boolean;
  template: TemplateRef<unknown>;
}

@Component({
  selector: 'ngp-tabs',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet, NgpTabset, NgpTabList, NgpTabButton, NgpTabPanel],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpTabsComponent,
    },
  ],
})
export class NgpTabsComponent implements ControlValueAccessor, AfterContentInit {
  readonly appearance = input<'underlined' | 'pill' | 'cards'>('underlined');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly stretch = input(false, { transform: booleanAttribute });
  readonly activateOnFocus = input(false, { transform: booleanAttribute });

  readonly activeValueChange = output<string | null>();

  private readonly tabDirectives = contentChildren(NgpTabDirective);
  private readonly tabs = signal<InternalTab[]>([]);
  private readonly activeValue = signal<string | undefined>(undefined);

  readonly tabsList = this.tabs;
  readonly currentValue = this.activeValue;

  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  ngAfterContentInit(): void {
    effect(
      () => {
        const directives = this.tabDirectives();
        this.tabs.set(directives.map((tab, index) => this.toInternalTab(tab, index)));
        const current = this.activeValue();
        if (!this.tabs().some((tab) => tab.value === current)) {
          const firstEnabled = this.tabs().find((tab) => !tab.disabled);
          this.activeValue.set(firstEnabled?.value);
        }
      },
      { allowSignalWrites: true },
    );
  }

  // region ControlValueAccessor
  writeValue(value: string | null): void {
    this.activeValue.set(value ?? undefined);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // disabling handled via individual tabs
  }
  // endregion

  onPrimitiveChange(value?: string): void {
    this.activeValue.set(value);
    this.onChange(value ?? null);
    this.activeValueChange.emit(value ?? null);
  }

  handleBlur(): void {
    this.onTouched();
  }

  trackTab(_: number, tab: InternalTab): string {
    return tab.value;
  }

  private toInternalTab(tab: NgpTabDirective, index: number): InternalTab {
    const value = tab.value() ?? tab.id() ?? `${tab.label()}-${index}`;
    return {
      value,
      label: tab.label(),
      badge: tab.badge(),
      icon: tab.icon(),
      disabled: tab.disabled(),
      template: tab.templateRef,
    };
  }
}
