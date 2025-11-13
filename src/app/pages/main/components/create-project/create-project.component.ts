import { Component, computed, inject, signal } from '@angular/core';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { UICalloutComponent } from '../../../../shared/components/callout/callout.component';
import { UiFormOrderComponent } from '../../../../shared/forms/order/order.component';
import { ScrollService } from 'src/app/core/services/scroll.service';

export type TTiers = 'start' | 'pro' | 'scale';
type TData = {
  title: string;
  text: string;
  tier: TTiers;
  best: string;
  from: string;
  estimate: string;
  included: string[];
  color: string;
  gradient: string;
};

@Component({
  selector: 'section-create-project',
  imports: [UIIconComponent, UICalloutComponent, UiFormOrderComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
  standalone: true,
})
export class CreateProjectSectionComponent {
  private scroll = inject(ScrollService);

  readonly data: TData[] = [
    {
      title: 'Start',
      tier: 'start',
      text: 'Launch a clickable Web3 interface fast, with clear scope and weekly demos.',
      best: 'MVP/POC with 1–2 core flows.',
      from: '6.5k',
      estimate: '2-4',
      included: [
        'Up to 2 networks (mainnet/testnet ready)',
        '1 contracts wired (read/write)',
        '1 language (EN)',
        'Analytics & SEO basics',
        'Branded UI kit + responsive',
        'Delivery: weekly demos, open board & repo*',
      ],
      color: 'pink-1',
      gradient: '#ff76af,#f8494c',
    },
    {
      title: 'Pro',
      tier: 'pro',
      text: 'The sweet spot for real users—modular features, API wiring, and calm UX.',
      best: 'Full module set (ex. Swap/Liquidity)',
      from: '10k',
      estimate: '3-5',
      included: [
        'Up to 3 networks',
        '2–5 contracts / module',
        'Multi-language: 2 languages (EN + 1)',
        'API integration: REST/GraphQL/Subgraph',
        'Analytics events on key on-chain actions',
      ],
      color: 'orange-1',
      gradient: '#f59e0b,#f97316',
    },
    {
      title: 'Scale',
      tier: 'scale',
      text: 'End-to-end product delivery with custom UX, dashboards, and release handover.',
      best: 'Multi-module product  (ex. Admins)',
      from: '15k',
      estimate: '4+',
      included: [
        'Up to 4 networks',
        'Multi-module UX flows',
        'Custom UX & states',
        'Release prep + docs & handover',
      ],
      color: 'blue-2',
      gradient: '#06b6d4,#3b82f6',
    },
  ];

  readonly selected = signal<number>(0);
  readonly formData = computed<TData>(() => this.data[this.selected()]);

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
