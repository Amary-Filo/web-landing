import { Component, inject, OnDestroy, signal } from '@angular/core';
import { UiArrowLineComponent } from '@components/arrow-line/arrow-line.component';
import { ScrollService } from '@services/scroll.service';

@Component({
  selector: 'section-hero',
  standalone: true,
  imports: [UiArrowLineComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroSectionComponent implements OnDestroy {
  private scroll = inject(ScrollService);
  private readonly texts = ['DeFi', 'DEX', 'dApps', 'Crypto', 'Staking', 'Auctions'];
  private readonly colors = ['pink-1', 'blue-1', 'orange-1', 'green-1', 'purple-2', 'blue-2'];

  private idx = 0;
  private intervalId?: ReturnType<typeof setInterval>;

  readonly text = signal(this.texts[0]);
  readonly color = signal(this.colors[0]);
  readonly isAnimating = signal(false);

  constructor() {
    this.intervalId = setInterval(() => {
      this.isAnimating.set(true);

      this.idx = (this.idx + 1) % this.texts.length;
      this.text.set(this.texts[this.idx]);
      this.color.set(this.colors[this.idx]);

      setTimeout(() => this.isAnimating.set(false), 600);
    }, 4000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
