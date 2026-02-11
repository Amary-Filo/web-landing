import { Component, inject } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { IconName } from '@components/icon/types';

import { UIIconComponent } from '@components/icon/icon.component';
import { UiInfoBlockComponent } from '@components/info-block/info-block.component';

type TData = {
  icon: IconName;
  title: string;
  text: string;
  color: string;
  badges: TBageKeys[];

  // When data are available
  // from: string;
  // estimate: string;
  // demoLink?: boolean;
  // images?: string[];
  // videoLink?: string;
};

type TBageKeys = 'poc' | 'mvp' | 'admin' | 'nft';

type TBage = {
  icon: IconName;
  title: string;
  color: string;
};

@Component({
  selector: 'section-showcase',
  imports: [UIIconComponent, UiInfoBlockComponent],
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.scss',
  standalone: true,
})
export class SolutionsSectionComponent {
  private scroll = inject(ScrollService);

  readonly badge: Record<TBageKeys, TBage> = {
    poc: {
      title: 'POC',
      icon: 'fireFill',
      color: 'purple-1',
    },
    mvp: {
      title: 'MVP',
      icon: 'diamondFill',
      color: 'blue-1',
    },
    admin: {
      title: 'Admin',
      icon: 'diamondFill',
      color: 'blue-1',
    },
    nft: {
      title: 'NFT',
      icon: 'diamondFill',
      color: 'blue-1',
    },
  };

  readonly data: TData[] = [
    {
      icon: 'rocket2Fill',
      title: 'DeFi dApp MVP',
      text: 'Wallet onboarding, EVM integrations and branded UI connected to your contracts with a live testnet demo.',
      color: 'pink-1',
      badges: ['poc'],
    },
    {
      icon: 'exchange2Fill',
      title: 'DEX UI ',
      text: 'Production-ready UI blocks for swaps, pools and farming with clear pricing, slippage and confirmations.',
      color: 'blue-1',
      badges: ['poc'],
    },
    {
      icon: 'calendarScheduleFill',
      title: 'Vesting & Token',
      text: 'Cliff & linear schedules, claims, roles and exports, all in a clean, auditable interface.',
      color: 'orange-1',
      badges: ['poc'],
    },
    {
      icon: 'handCoinFill',
      title: 'Staking & Rewards',
      text: 'Wallet onboarding, EVM integrations and branded UI connected to your contracts with a live testnet demo.',
      color: 'green-1',
      badges: ['poc'],
    },
    {
      icon: 'barChartBoxAiFill',
      title: 'Dashboards & Admin',
      text: 'Metrics, filters and role-based controls to run your Web3 product with confidence.',
      color: 'purple-1',
      badges: ['mvp'],
    },
  ];

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
