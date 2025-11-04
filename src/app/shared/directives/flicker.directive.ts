// flicker.directive.ts
import { Directive, Input, OnInit, OnDestroy, signal } from '@angular/core';

@Directive({
  selector: '[appFlicker]',
  standalone: true,
  host: {
    '[style.--flicker-opacity]': 'flicker()',
  },
})
export class FlickerDirective implements OnInit, OnDestroy {
  @Input() flickerIntensity: 'low' | 'medium' | 'high' = 'high';

  flicker = signal('1');
  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    const config: Record<string, any> = {
      low: { min: 150, max: 400, chance: 0.95 },
      medium: { min: 80, max: 250, chance: 0.85 },
      high: { min: 50, max: 180, chance: 0.75 },
    };

    const cfg = config[this.flickerIntensity];

    this.interval = setInterval(() => {
      this.flicker.set(Math.random() < cfg.chance ? '1' : String(1 - Math.random() * 0.4));
    }, Math.random() * (cfg.max - cfg.min) + cfg.min);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval!);
  }
}
