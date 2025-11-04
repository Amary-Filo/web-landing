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

@Component({
  selector: "ngp-toggle",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./toggle.component.html",
  styleUrls: ["./toggle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpToggleComponent,
    },
  ],
})
export class NgpToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() activeLabel?: string;
  @Input() icon?: string;
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() appearance: "solid" | "soft" | "outline" = "soft";
  @Input() disabled = false;

  @Output() valueChange = new EventEmitter<boolean>();

  value = false;

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  writeValue(value: boolean | null): void {
    this.value = Boolean(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.value = !this.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.cdr.markForCheck();
  }

  onBlur(): void {
    this.onTouched();
  }

  get displayLabel(): string | undefined {
    if (this.value && this.activeLabel) {
      return this.activeLabel;
    }
    return this.label;
  }
}

