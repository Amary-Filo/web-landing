import { Component, inject } from '@angular/core';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { IconName } from '../../../../shared/components/icon/types';
import { UiInfoBlockComponent } from '../../../../shared/components/info-block/info-block.component';
import { ScrollService } from 'src/app/core/services/scroll.service';

type TData = {
  img: string;
  icon: IconName;
  title: string;
  subtext: string;
  text: string;
  from: string;
  estimate: string;
  scope: string;
  color: string;
  badges: TBageKeys[];
  hasDemo?: boolean;
};

type TBageKeys = 'popular' | 'mvp';

type TBage = {
  icon: IconName;
  title: string;
  color: string;
};

@Component({
  selector: 'section-solutions',
  imports: [UIIconComponent, UiInfoBlockComponent],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss',
  standalone: true,
})
export class SolutionsSectionComponent {
  private scroll = inject(ScrollService);

  readonly badge: Record<TBageKeys, TBage> = {
    popular: {
      title: 'Popular',
      icon: 'fireFill',
      color: 'purple-1',
    },
    mvp: {
      title: 'MVP',
      icon: 'diamondFill',
      color: 'blue-1',
    },
  };

  readonly data: TData[] = [
    {
      img: 'defi.png',
      icon: 'rocket2Fill',
      title: 'DeFi dApp MVP',
      subtext: 'Ship a usable Web3 interface in weeks, not months.',
      text: 'Wallet onboarding, EVM integrations and branded UI connected to your contracts with a live testnet demo.',
      from: '6.5k',
      estimate: '2-4',
      scope: 'Start',
      color: 'pink-1',
      badges: ['mvp', 'popular'],
      hasDemo: true,
    },
    {
      img: 'dex.png',
      icon: 'exchange2Fill',
      title: 'DEX UI ',
      subtext: 'Modular exchange components tailored to your protocol.',
      text: 'Production-ready UI blocks for swaps, pools and farming with clear pricing, slippage and confirmations.',
      from: '6.5k',
      estimate: '2-4',
      scope: 'Start',
      color: 'blue-1',
      badges: ['popular'],
      hasDemo: true,
    },
    {
      img: 'vesting.png',
      icon: 'calendarScheduleFill',
      title: 'Vesting & Token',
      subtext: 'Clear vesting schedules and token tools for teams and investors.',
      text: 'Cliff & linear schedules, claims, roles and exports, all in a clean, auditable interface.',
      from: '6.5k',
      estimate: '2-4',
      scope: 'Start',
      color: 'orange-1',
      badges: [],
    },
    {
      img: 'staking.png',
      icon: 'handCoinFill',
      title: 'Staking & Rewards',
      subtext: 'Stake, harvest, track history with transparent APR/APY and clear gas/fee feedback.',
      text: 'Wallet onboarding, EVM integrations and branded UI connected to your contracts with a live testnet demo.',
      from: '6.5k',
      estimate: '2-4',
      scope: 'Start',
      color: 'green-1',
      badges: ['popular'],
      hasDemo: true,
    },
    {
      img: 'dashboards.png',
      icon: 'barChartBoxAiFill',
      title: 'Dashboards & Admin',
      subtext: 'Operational visibility for your token, pools and users.',
      text: 'Metrics, filters and role-based controls to run your Web3 product with confidence.',
      from: '6.5k',
      estimate: '2-4',
      scope: 'Start',
      color: 'purple-1',
      badges: [],
    },
  ];

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
