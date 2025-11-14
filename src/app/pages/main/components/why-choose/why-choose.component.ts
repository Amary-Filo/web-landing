import { Component, inject } from '@angular/core';
import { ScrollService } from '@services/scroll.service';

import { IconName } from '@components/icon/types';
import { UIIconComponent } from '@components/icon/icon.component';
import { UiInfoBlockComponent } from '@components/info-block/info-block.component';

type TData = {
  title: string;
  text: string;
  icon: IconName;
};

@Component({
  selector: 'section-why',
  imports: [UIIconComponent, UiInfoBlockComponent],
  templateUrl: './why-choose.component.html',
  styleUrl: './why-choose.component.scss',
  standalone: true,
})
export class WhyChooseSectionComponent {
  private scroll = inject(ScrollService);
  readonly data: TData[] = [
    {
      title: 'Fast, focused delivery',
      text: 'Ship visible progress weekly, minus the fluff.',
      icon: 'focus3Line',
    },
    {
      title: 'Live previews, always',
      text: 'Click through the project at every stage.',
      icon: 'mouseFill',
    },
    {
      title: 'Full transparency',
      text: 'Open repo & board; clear scope and notes.',
      icon: 'verifiedBadgeFill',
    },
    {
      title: 'Communication',
      text: 'One owner, same-day updates, clear next steps.',
      icon: 'messageAi3Line',
    },
    {
      title: 'Documented handover',
      text: 'Docs, runbooks, tidy code you can keep.',
      icon: 'gitRepositoryFill2',
    },
    {
      title: 'Stable & extensible',
      text: 'Built to add networks, modules, languages later.',
      icon: 'codeFill',
    },
  ];

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
