import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  Renderer2,
  SimpleChanges,
  input,
  signal,
  effect,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Icons, IconName } from './types';

let NEXT_ID = 0;

type GradientInput = string | string[] | null | undefined;

@Component({
  selector: 'ui-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  imports: [NgIcon],
  providers: [provideIcons(Icons)],
})
export class UIIconComponent implements AfterViewInit, OnChanges {
  name = input<IconName>();
  size = input<string>('1em');
  gradient = input<GradientInput>(null);
  gradientId = `ui-icon-grad-${++NEXT_ID}`;

  stop1 = signal<string>('#000');
  stop2 = signal<string>('#000');

  private observer?: MutationObserver;

  constructor(private el: ElementRef, private r: Renderer2) {
    effect(() => {
      const g = this.gradient();
      const [c1, c2] = this.normalizeGradient(g);
      this.stop1.set(c1);
      this.stop2.set(c2);
      this.applyFill();
    });
  }

  ngAfterViewInit() {
    const host: HTMLElement = this.el.nativeElement;
    this.observer = new MutationObserver(() => this.applyFill());
    this.observer.observe(host, { childList: true, subtree: true });

    queueMicrotask(() => this.applyFill());
  }

  ngOnChanges(_: SimpleChanges) {
    queueMicrotask(() => this.applyFill());
  }

  private normalizeGradient(g: GradientInput): [string, string] {
    if (!g) return ['#000000', '#000000'];
    if (Array.isArray(g)) {
      const a = g[0]?.trim() || '#000000';
      const b = g[1]?.trim() || a;
      return [a, b];
    }

    const parts = g
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length >= 2) return [parts[0], parts[1]];
    const single = parts[0] || '#000000';
    return [single, single];
  }

  private getSvgRoot(): SVGElement | null {
    return this.el.nativeElement.querySelector('ng-icon svg');
  }

  private applyFill() {
    const svg = this.getSvgRoot();
    if (!svg) return;

    const hasGradient = !!this.gradient();

    const nodes = svg.querySelectorAll<SVGElement>(
      'path, rect, circle, ellipse, polygon, polyline, line, g, use'
    );

    nodes.forEach((node) =>
      hasGradient
        ? this.r.setAttribute(node, 'fill', `url(#${this.gradientId})`)
        : this.r.setAttribute(node, 'fill', 'currentColor')
    );
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
