import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { NgpTabDirective } from "./tab.directive";

@Component({
  selector: "ngp-tabs",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: NgpTabsComponent,
    },
  ],
})
export class NgpTabsComponent
  implements ControlValueAccessor, AfterContentInit
{
  @Input() appearance: "underlined" | "pill" | "cards" = "underlined";
  @Input() orientation: "horizontal" | "vertical" = "horizontal";
  @Input() stretch = true;
  @Input() disabled = false;
  @Input() gap = "var(--tabs-gap, 0.5rem)";

  @Output() activeIdChange = new EventEmitter<string>();

  @ContentChildren(NgpTabDirective)
  tabs!: QueryList<NgpTabDirective>;

  activeId?: string;
  private onChange: (value: string | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  writeValue(value: string | null): void {
    this.setActiveId(value ?? undefined, false);
  }

  get activeTab(): NgpTabDirective | undefined {
    if (!this.tabs) {
      return undefined;
    }
    if (this.activeId) {
      return this.findTabById(this.activeId);
    }
    return this.tabs.find((tab) => !tab.disabled);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    if (!this.activeId) {
      const firstEnabled = this.tabs.find((tab) => !tab.disabled);
      this.activeId = firstEnabled?.id ?? firstEnabled?.label ?? undefined;
    }
    this.cdr.markForCheck();
  }

  onTabClick(tab: NgpTabDirective): void {
    if (this.disabled || tab.disabled) {
      return;
    }
    this.setActiveId(tab.id ?? tab.label);
  }

  isActive(tab: NgpTabDirective): boolean {
    const id = tab.id ?? tab.label;
    return id === this.activeId;
  }

  trackByTab(_: number, tab: NgpTabDirective): string {
    return tab.id ?? tab.label;
  }

  @HostListener("keydown", ["$event"])
  onKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const list = this.tabs?.toArray() ?? [];
    if (!list.length) {
      return;
    }
    const currentIdx = list.findIndex((tab) => this.isActive(tab));
    if (currentIdx === -1) {
      return;
    }
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const next = this.findNextEnabled(list, currentIdx, 1);
      if (next) {
        this.setActiveId(next.id ?? next.label);
      }
    }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const prev = this.findNextEnabled(list, currentIdx, -1);
      if (prev) {
        this.setActiveId(prev.id ?? prev.label);
      }
    }
  }

  private setActiveId(id?: string, emit = true): void {
    if (!id) {
      this.activeId = undefined;
    } else {
      const tab = this.findTabById(id);
      if (!tab || tab.disabled) {
        return;
      }
      this.activeId = tab.id ?? tab.label;
    }
    if (emit) {
      this.onChange(this.activeId ?? null);
      if (this.activeId) {
        this.activeIdChange.emit(this.activeId);
      }
    }
    this.cdr.markForCheck();
  }

  private findTabById(id: string): NgpTabDirective | undefined {
    return this.tabs?.find((tab) => (tab.id ?? tab.label) === id);
  }

  private findNextEnabled(
    tabs: NgpTabDirective[],
    startIndex: number,
    direction: 1 | -1,
  ): NgpTabDirective | undefined {
    const count = tabs.length;
    let index = startIndex;
    do {
      index = (index + direction + count) % count;
      const candidate = tabs[index];
      if (!candidate.disabled) {
        return candidate;
      }
    } while (index !== startIndex);
    return undefined;
  }
}
