import { Component, inject } from '@angular/core';
import { ScrollService } from '@services/scroll.service';

@Component({
  selector: 'section-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroSectionComponent {
  private scroll = inject(ScrollService);

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
