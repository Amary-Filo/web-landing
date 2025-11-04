import { Component } from '@angular/core';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { IconName } from '../../../../shared/components/icon/types';
import { UiInfoBlockComponent } from '../../../../shared/components/info-block/info-block.component';

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

  btnClick() {
    console.log('Click');
  }
}
