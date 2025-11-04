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

type NgpComboboxDataset = "countries" | "timezones";

@Component({
  selector: "ngp-combobox",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./combobox.component.html",
  styleUrls: ["./combobox.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpComboboxComponent,
    },
  ],
})
export class NgpComboboxComponent<T = unknown>
  implements ControlValueAccessor, OnDestroy
{
  @Input() placeholder = "Начните вводить...";
  @Input() disabled = false;
  @Input() searchable = true;
  @Input() triggerMode: "field" | "button" = "field";
  @Input() clearable = true;
  @Input() compareWith: (a: T | null, b: T | null) => boolean = (a, b) =>
    a === b;
  @Input() autoOpenOnFocus = true;

  @Output() valueChange = new EventEmitter<T | null>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild("panel", { read: ElementRef })
  panelRef?: ElementRef<HTMLDivElement>;

  @ViewChild("inputField", { read: ElementRef })
  inputField?: ElementRef<HTMLInputElement>;

  panelOpen = false;
  searchTerm = "";
  keyboardActiveIndex = -1;

  private _options: NgpOption<T>[] = [];
  private _groups: NgpOptionGroup<T>[] = [];
  private _dataset?: NgpComboboxDataset;
  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  private documentClickUnlisten?: () => void;

  selectedOption: NgpOption<T> | null = null;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly dataService: NgpKitDataService,
  ) {}

  @Input()
  set options(options: NgpOption<T>[] | null) {
    this._options = options ?? [];
    this._groups = [];
    this.syncValue();
  }

  get options(): NgpOption<T>[] {
    return this._options;
  }

  @Input()
  set optionGroups(groups: NgpOptionGroup<T>[] | null) {
    this._groups = groups ?? [];
    this._options = [];
    this.syncValue();
  }

  get optionGroups(): NgpOptionGroup<T>[] {
    return this._groups;
  }

  @Input()
  set dataset(value: NgpComboboxDataset | undefined) {
    if (value && value !== this._dataset) {
      this._dataset = value;
      this.resolveDataset(value);
    }
  }

  get hasGroups(): boolean {
    return this._groups.length > 0;
  }

  get filteredOptions(): NgpOption<T>[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this._options;
    }
    return this._options.filter((option) =>
      [option.label, option.hint ?? ""].some((prop) =>
        (prop ?? "").toLowerCase().includes(term),
      ),
    );
  }

  get filteredGroups(): NgpOptionGroup<T>[] {
    if (!this.hasGroups) {
      return [];
    }
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this._groups;
    }
    return this._groups
      .map((group) => ({
        ...group,
        options: group.options.filter((option: NgpOption<T>) =>
          [option.label, option.hint ?? ""].some((prop) =>
            (prop ?? "").toLowerCase().includes(term),
          ),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }

  writeValue(value: T | null): void {
    const match = this.findOption(value);
    this.selectedOption = match;
    if (this.triggerMode === "field" && match) {
      this.searchTerm = match.label;
    }
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

  ngOnDestroy(): void {
    this.detachDocumentListener();
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
    if (this.searchable && this.triggerMode === "field") {
      queueMicrotask(() => this.inputField?.nativeElement.select());
    }
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
    if (this.triggerMode === "field" && this.selectedOption) {
      this.searchTerm = this.selectedOption.label;
    }
    this.closed.emit();
    this.cdr.markForCheck();
  }

  onSelect(option: NgpOption<T>): void {
    if (option.disabled) {
      return;
    }
    this.selectedOption = option;
    this.searchTerm = option.label;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.closePanel();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.searchTerm = "";
    this.selectedOption = null;
    this.onChange(null);
    this.valueChange.emit(null);
    if (this.triggerMode === "field" && this.searchable) {
      queueMicrotask(() => this.inputField?.nativeElement.focus());
    }
  }

  onInput(event: Event): void {
    if (!this.searchable) {
      return;
    }
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchChange.emit(this.searchTerm);
    if (!this.panelOpen && this.autoOpenOnFocus) {
      this.openPanel();
    } else {
      this.cdr.markForCheck();
    }
  }

  onInputFocus(): void {
    this.onTouched();
    if (this.autoOpenOnFocus) {
      this.openPanel();
    }
  }

  onToggleButtonFocus(): void {
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
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
    }
    switch (event.key) {
      case "ArrowDown":
        this.openPanel();
        this.moveActiveIndex(1);
        break;
      case "ArrowUp":
        this.openPanel();
        this.moveActiveIndex(-1);
        break;
      case "Enter":
        if (this.panelOpen) {
          this.selectActiveOption();
        } else {
          this.openPanel();
        }
        break;
      case " ":
        if (!this.searchable || this.triggerMode === "button") {
          this.togglePanel();
        }
        break;
      case "Escape":
        this.closePanel();
        break;
      default:
        break;
    }
  }

  private resolveDataset(dataset: NgpComboboxDataset): void {
    if (dataset === "countries") {
      this.optionGroups = this.dataService.getCountryOptions() as unknown as NgpOptionGroup<T>[];
    } else if (dataset === "timezones") {
      this.optionGroups = this.dataService.getTimezoneGroups() as unknown as NgpOptionGroup<T>[];
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

  private selectActiveOption(): void {
    const options = this.getLinearOptions();
    const active = options[this.keyboardActiveIndex];
    if (active && !active.disabled) {
      this.onSelect(active);
    }
  }

  private getLinearOptions(): NgpOption<T>[] {
    return this.hasGroups
      ? this.filteredGroups.flatMap((group) => group.options)
      : this.filteredOptions;
  }

  private moveActiveIndex(direction: 1 | -1): void {
    const list = this.getLinearOptions();
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
    const optionElements = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-ngp-option]"),
    );
    const active = optionElements[this.keyboardActiveIndex];
    if (active) {
      active.scrollIntoView({ block: "nearest" });
    }
  }
}
