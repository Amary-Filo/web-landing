import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { NgpOption } from "../models/ngp-option.model";

@Component({
  selector: "ngp-checkbox-group",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./checkbox-group.component.html",
  styleUrls: ["./checkbox-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpCheckboxGroupComponent,
    },
  ],
})
export class NgpCheckboxGroupComponent<T = unknown>
  implements ControlValueAccessor
{
  @Input() options: NgpOption<T>[] = [];
  @Input() layout: "horizontal" | "vertical" = "vertical";
  @Input() disabled = false;
  @Input() legend?: string;
  @Input() description?: string;
  @Input() name = `ngp-checkbox-${Math.random().toString(36).slice(2)}`;
  @Input() size: "sm" | "md" | "lg" = "md";

  @Input() compareWith: (a: T, b: T) => boolean = (a, b) => a === b;

  @Output() valueChange = new EventEmitter<T[]>();

  value: T[] = [];

  private onChange: (value: T[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  writeValue(value: T[] | null): void {
    this.value = Array.isArray(value) ? [...value] : [];
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onToggle(option: NgpOption<T>): void {
    if (this.disabled || option.disabled) {
      return;
    }
    const exists = this.value.some((item) =>
      this.compareWith(item, option.value),
    );
    if (exists) {
      this.value = this.value.filter(
        (item) => !this.compareWith(item, option.value),
      );
    } else {
      this.value = [...this.value, option.value];
    }
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.cdr.markForCheck();
  }

  isChecked(option: NgpOption<T>): boolean {
    return this.value.some((item) => this.compareWith(item, option.value));
  }

  trackByOption(_: number, option: NgpOption<T>): string | number {
    return typeof option.value === "string" || typeof option.value === "number"
      ? option.value
      : option.label;
  }

  onBlur(): void {
    this.onTouched();
  }
}
