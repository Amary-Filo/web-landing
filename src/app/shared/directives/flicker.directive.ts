import {
  Directive,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

type Intensity = 'low' | 'medium' | 'high';
type Cfg = { min: number; max: number; chance: number };

@Directive({
  selector: '[appFlicker]',
  standalone: true,
})
export class FlickerDirective implements OnInit, OnDestroy, OnChanges {
  @Input() flickerIntensity: Intensity = 'high';

  private cfgs: Record<Intensity, Cfg> = {
    low: { min: 150, max: 400, chance: 0.95 },
    medium: { min: 80, max: 250, chance: 0.85 },
    high: { min: 50, max: 180, chance: 0.75 },
  };

  private stopped = false;
  private timeoutId: any = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    // Важно: задать стартовое значение, чтобы сразу что-то было видно.
    this.set('--flicker-opacity', '1');
    this.loop();
  }

  ngOnChanges(ch: SimpleChanges) {
    if (ch['flickerIntensity'] && !ch['flickerIntensity'].firstChange) {
      this.stop();
      this.loop();
    }
  }

  ngOnDestroy() {
    this.stop();
  }

  private loop() {
    this.stopped = false;
    const cfg = this.cfgs[this.flickerIntensity];

    const tick = () => {
      if (this.stopped) return;

      const val = Math.random() < cfg.chance ? '1' : (1 - Math.random() * 0.4).toFixed(3);
      this.set('--flicker-opacity', val);

      const delay = cfg.min + Math.random() * (cfg.max - cfg.min);
      this.timeoutId = setTimeout(() => requestAnimationFrame(tick), delay);
    };

    tick();
  }

  private stop() {
    this.stopped = true;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  private set(name: string, value: string) {
    // setProperty надёжнее для CSS-переменных, чем setAttribute/Renderer2.setStyle
    this.el.nativeElement.style.setProperty(name, value);
  }
}
