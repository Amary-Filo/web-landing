import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Type,
  ViewChild,
  ViewContainerRef,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgpDialog,
  NgpDialogDescription,
  NgpDialogOverlay,
  NgpDialogTitle,
  provideDialogState,
} from 'ng-primitives/dialog';
import { NgpDialogAnimation, NgpDialogButton, NgpDialogConfig } from '../models/ngp-dialog.model';

@Component({
  selector: 'ngp-dialog',
  standalone: true,
  imports: [CommonModule, NgpDialog, NgpDialogOverlay, NgpDialogTitle, NgpDialogDescription],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideDialogState()],
})
export class NgpDialogComponent implements AfterViewInit {
  readonly openModel = model(false, { alias: 'open' });
  readonly config = input<NgpDialogConfig | null>(null);
  readonly animation = input<NgpDialogAnimation>('fade');
  readonly contentComponent = input<Type<unknown> | undefined>(undefined);
  readonly contentInputs = input<Record<string, unknown> | undefined>(undefined);
  readonly contentOutputs = input<Record<string, (value: unknown) => void> | undefined>(undefined);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly action = output<{ action: string; value?: unknown }>();

  @ViewChild('dynamicHost', { read: ViewContainerRef })
  dynamicHost?: ViewContainerRef;

  readonly open = this.openModel;
  readonly backdropClosable = signal(true);
  readonly buttons = signal<NgpDialogButton[]>([]);

  private readonly viewReady = signal(false);
  private dynamicComponentRef?: any;

  constructor() {
    effect(() => {
      const config = this.config();
      this.buttons.set(config?.buttons ?? []);
      this.backdropClosable.set(config?.backdropClosable !== false);
    });

    effect(
      () => {
        if (!this.viewReady()) {
          return;
        }
        const isOpen = this.open();
        if (isOpen) {
          this.renderDynamicContent();
          this.applyScrollLock(true);
          this.opened.emit();
        } else {
          this.clearDynamicContent();
          this.applyScrollLock(false);
          this.closed.emit();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (!this.viewReady() || !this.open()) {
          return;
        }
        this.contentComponent();
        this.contentInputs();
        this.contentOutputs();
        this.renderDynamicContent();
      },
      { allowSignalWrites: true },
    );
  }

  ngAfterViewInit(): void {
    this.viewReady.set(true);
    if (this.open()) {
      this.renderDynamicContent();
      this.applyScrollLock(true);
      this.opened.emit();
    }
  }

  get heading(): string | undefined {
    return this.config()?.heading;
  }

  get subheading(): string | undefined {
    return this.config()?.subheading;
  }

  get isBackdropClosable(): boolean {
    return this.backdropClosable();
  }

  close(): void {
    if (!this.open()) {
      return;
    }
    this.openModel.set(false);
  }

  onOverlayClick(event: MouseEvent): void {
    if (!this.isBackdropClosable) {
      return;
    }
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onButtonClick(button: NgpDialogButton): void {
    if (button.action === 'close') {
      this.close();
    }
    this.action.emit({ action: button.action, value: button.value });
  }

  private renderDynamicContent(): void {
    if (!this.dynamicHost) {
      return;
    }
    this.dynamicHost.clear();
    this.dynamicComponentRef?.destroy();
    this.dynamicComponentRef = undefined;

    const componentType = this.contentComponent();
    if (!componentType) {
      return;
    }

    const componentRef = this.dynamicHost.createComponent(componentType);
    const inputs = this.contentInputs();
    if (inputs) {
      Object.entries(inputs).forEach(([key, value]) => {
        (componentRef.instance as Record<string, unknown>)[key] = value;
      });
    }

    const outputs = this.contentOutputs();
    if (outputs) {
      Object.entries(outputs).forEach(([key, handler]) => {
        const output = (componentRef.instance as Record<string, unknown>)[key];
        if (output instanceof EventEmitter) {
          output.subscribe(handler);
        }
      });
    }

    componentRef.changeDetectorRef.markForCheck();
    this.dynamicComponentRef = componentRef;
  }

  private clearDynamicContent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = undefined;
    }
    this.dynamicHost?.clear();
  }

  private applyScrollLock(locked: boolean): void {
    document.documentElement.classList.toggle('ngp-dialog-scroll-lock', locked);
  }
}
