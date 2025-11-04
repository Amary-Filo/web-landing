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
  selector: "ngp-radio-group",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./radio-group.component.html",
  styleUrls: ["./radio-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpRadioGroupComponent,
    },
  ],
})
export class NgpRadioGroupComponent<T = unknown>
  implements ControlValueAccessor
{
  @Input() options: NgpOption<T>[] = [];
  @Input() layout: "horizontal" | "vertical" = "vertical";
  @Input() disabled = false;
  @Input() name = `ngp-radio-${Math.random().toString(36).slice(2)}`;
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() legend?: string;
  @Input() description?: string;

  @Input() compareWith: (a: T | null, b: T | null) => boolean = (a, b) =>
    a === b;

  @Output() valueChange = new EventEmitter<T | null>();

  value: T | null = null;

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  writeValue(value: T | null): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  onOptionSelect(option: NgpOption<T>): void {
    if (this.disabled || option.disabled) {
      return;
    }
    this.value = option.value;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.cdr.markForCheck();
  }

  isChecked(option: NgpOption<T>): boolean {
    return this.compareWith(option.value, this.value);
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
