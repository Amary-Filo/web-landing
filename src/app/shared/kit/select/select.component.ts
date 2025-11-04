import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { NgpOption, NgpOptionGroup } from "../models/ngp-option.model";
import { NgpKitDataService } from "../data/kit-data.service";

type NgpSelectDataset = "countries" | "timezones";

@Component({
  selector: "ngp-select",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpSelectComponent,
    },
  ],
})
export class NgpSelectComponent<T = unknown>
  implements ControlValueAccessor, OnDestroy
{
  @Input() placeholder = "Выберите значение";
  @Input() disabled = false;
  private _dataset?: NgpSelectDataset;
  @Input() clearable = false;
  @Input() compareWith: (a: T | null, b: T | null) => boolean = (a, b) =>
    a === b;
  @Input() panelMaxHeight = "var(--select-panel-max-height)";

  @Output() valueChange = new EventEmitter<T | null>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild("triggerButton", { read: ElementRef })
  triggerButton?: ElementRef<HTMLButtonElement>;

  @ViewChild("panel", { read: ElementRef })
  panelRef?: ElementRef<HTMLDivElement>;

  panelOpen = false;
  keyboardActiveIndex = -1;

  private _options: NgpOption<T>[] = [];
  private _groups: NgpOptionGroup<T>[] = [];
  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private documentClickUnlisten?: () => void;

  selectedOption: NgpOption<T> | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly kitData: NgpKitDataService,
  ) {}

  @Input()
  set dataset(value: NgpSelectDataset | undefined) {
    if (value && value !== this._dataset) {
      this._dataset = value;
      this.resolveDataset(value);
    }
  }

  get dataset(): NgpSelectDataset | undefined {
    return this._dataset;
  }

  @Input()
  set options(options: NgpOption<T>[] | null) {
    this._options = options ?? [];
    this._groups = [];
    this.syncValue();
  }

  @Input()
  set optionGroups(groups: NgpOptionGroup<T>[] | null) {
    this._groups = groups ?? [];
    this._options = [];
    this.syncValue();
  }

  get options(): NgpOption<T>[] {
    return this._options;
  }

  get optionGroups(): NgpOptionGroup<T>[] {
    return this._groups;
  }

  get hasGroups(): boolean {
    return this._groups.length > 0;
  }

  ngOnDestroy(): void {
    this.detachDocumentListener();
  }

  writeValue(value: T | null): void {
    const option = this.findOption(value);
    this.selectedOption = option;
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

  togglePanel(): void {
    if (this.disabled) {
      return;
    }
    this.panelOpen ? this.closePanel() : this.openPanel();
  }

  openPanel(): void {
    if (this.disabled || this.panelOpen) {
      return;
    }
    this.panelOpen = true;
    this.attachDocumentListener();
    this.opened.emit();
    this.cdr.markForCheck();
  }

  closePanel(): void {
    if (!this.panelOpen) {
      return;
    }
    this.panelOpen = false;
    this.keyboardActiveIndex = -1;
    this.detachDocumentListener();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onSelect(option: NgpOption<T>): void {
    if (option.disabled) {
      return;
    }
    this.selectedOption = option;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.closePanel();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedOption = null;
    this.onChange(null);
    this.valueChange.emit(null);
    this.closePanel();
  }

  onTriggerBlur(): void {
    this.onTouched();
  }

  isSelected(option: NgpOption<T>): boolean {
    if (!this.selectedOption) {
      return false;
    }
    return this.compareWith(option.value, this.selectedOption.value);
  }

  trackByOption(_: number, option: NgpOption<T>): string | number {
    return typeof option.value === "string" || typeof option.value === "number"
      ? option.value
      : option.label;
  }

  trackByGroup(_: number, group: NgpOptionGroup<T>): string {
    return group.label;
  }

  @HostListener("keydown", ["$event"])
  onHostKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.togglePanel();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.openPanel();
        this.moveActiveIndex(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.openPanel();
        this.moveActiveIndex(-1);
        break;
      case "Escape":
        this.closePanel();
        break;
      default:
        break;
    }
  }

  private syncValue(): void {
    if (!this.selectedOption) {
      return;
    }

    const match = this.findOption(this.selectedOption.value);
    if (!match) {
      this.selectedOption = null;
      this.onChange(null);
      this.valueChange.emit(null);
    } else {
      this.selectedOption = match;
    }
    this.cdr.markForCheck();
  }

  private findOption(value: T | null): NgpOption<T> | null {
    if (value == null) {
      return null;
    }
    const list = this.hasGroups
      ? this._groups.flatMap((group) => group.options)
      : this._options;

    return (
      list.find((option) => this.compareWith(option.value, value)) ?? null
    );
  }

  private resolveDataset(dataset: NgpSelectDataset): void {
    if (dataset === "countries") {
      this.optionGroups = this.kitData.getCountryOptions() as unknown as NgpOptionGroup<T>[];
    } else if (dataset === "timezones") {
      this.optionGroups = this.kitData.getTimezoneGroups() as unknown as NgpOptionGroup<T>[];
    }
    this.cdr.markForCheck();
  }

  private attachDocumentListener(): void {
    if (this.documentClickUnlisten) {
      return;
    }
    const handler = (event: MouseEvent) => {
      const host = this.elementRef.nativeElement;
      if (!host.contains(event.target as Node)) {
        this.closePanel();
      }
    };
    window.addEventListener("click", handler, true);
    this.documentClickUnlisten = () => {
      window.removeEventListener("click", handler, true);
      this.documentClickUnlisten = undefined;
    };
  }

  private detachDocumentListener(): void {
    if (this.documentClickUnlisten) {
      this.documentClickUnlisten();
    }
  }

  private moveActiveIndex(direction: 1 | -1): void {
    const list = this.hasGroups
      ? this._groups.flatMap((group) => group.options)
      : this._options;
    if (!list.length) {
      return;
    }
    let idx = this.keyboardActiveIndex;
    do {
      idx = (idx + direction + list.length) % list.length;
    } while (list[idx]?.disabled && idx !== this.keyboardActiveIndex);

    this.keyboardActiveIndex = idx;
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    if (!this.panelRef) {
      return;
    }
    const panel = this.panelRef.nativeElement;
    const list = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-ngp-option]"),
    );
    const active = list[this.keyboardActiveIndex];
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }
}
