import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  NgpDialogAnimation,
  NgpDialogConfig,
} from "../models/ngp-dialog.model";

@Component({
  selector: "ngp-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./dialog.component.html",
  styleUrls: ["./dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgpDialogComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() open = false;
  @Input() config: NgpDialogConfig | null = null;
  @Input() animation: NgpDialogAnimation = "fade";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() backdropClosable = true;
  @Input() contentComponent?: Type<unknown>;
  @Input() contentInputs?: Record<string, unknown>;
  @Input() contentOutputs?: Record<string, (value: unknown) => void>;

  @Output() closed = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  @Output() action = new EventEmitter<{ action: string; value?: unknown }>();

  @ViewChild("dynamicHost", { read: ViewContainerRef })
  dynamicHost?: ViewContainerRef;

  @ViewChild("dialogSurface", { read: ElementRef })
  surfaceRef?: ElementRef<HTMLDivElement>;

  @HostBinding("class.ngp-dialog-host")
  hostClass = true;

  private dynamicComponentRef?: ComponentRef<unknown>;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"]) {
      if (this.open) {
        this.attachGlobalLock();
        this.renderDynamicContent();
        this.opened.emit();
      } else {
        this.detachDynamicContent();
        this.releaseGlobalLock();
      }
    }
    if (
      changes["contentComponent"] ||
      changes["contentInputs"] ||
      changes["contentOutputs"]
    ) {
      if (this.open) {
        this.renderDynamicContent();
      }
    }
    this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
    if (this.open) {
      this.renderDynamicContent();
    }
  }

  ngOnDestroy(): void {
    this.releaseGlobalLock();
    this.detachDynamicContent();
  }

  get heading(): string | undefined {
    return this.config?.heading;
  }

  get subheading(): string | undefined {
    return this.config?.subheading;
  }

  get buttons() {
    return this.config?.buttons ?? [];
  }

  get showCloseButton(): boolean {
    if (this.config?.closeButton === false) {
      return false;
    }
    return true;
  }

  onDialogClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  onBackdropClick(): void {
    if (this.backdropClosable && this.config?.backdropClosable !== false) {
      this.close();
    }
  }

  @HostListener("document:keydown.escape", ["$event"])
  onEscape(event: KeyboardEvent | Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!this.open) {
      return;
    }
    keyboardEvent.preventDefault();
    if (this.backdropClosable && this.config?.backdropClosable !== false) {
      this.close();
    }
  }

  triggerButton(actionName: string, value?: unknown): void {
    if (actionName === "close") {
      this.close();
    }
    this.action.emit({ action: actionName, value });
  }

  close(): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    this.detachDynamicContent();
    this.releaseGlobalLock();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  private renderDynamicContent(): void {
    if (!this.dynamicHost) {
      return;
    }
    this.dynamicHost.clear();
    this.dynamicComponentRef?.destroy();
    this.dynamicComponentRef = undefined;
    if (!this.contentComponent) {
      return;
    }
    const componentRef = this.dynamicHost.createComponent(
      this.contentComponent,
    );
    if (this.contentInputs) {
      Object.entries(this.contentInputs).forEach(([key, value]) => {
        (componentRef.instance as Record<string, unknown>)[key] = value;
      });
    }
    if (this.contentOutputs) {
      Object.entries(this.contentOutputs).forEach(([key, handler]) => {
        const output = (componentRef.instance as Record<string, unknown>)[key];
        if (output instanceof EventEmitter) {
          output.subscribe(handler);
        }
      });
    }
    componentRef.changeDetectorRef.markForCheck();
    this.dynamicComponentRef = componentRef;
  }

  private detachDynamicContent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = undefined;
    }
    this.dynamicHost?.clear();
  }

  private attachGlobalLock(): void {
    document.documentElement.classList.add("ngp-dialog-scroll-lock");
  }

  private releaseGlobalLock(): void {
    document.documentElement.classList.remove("ngp-dialog-scroll-lock");
  }
}
