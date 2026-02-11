import { Component, computed, inject, signal } from '@angular/core';
import { ScrollService } from '@services/scroll.service';

import { IconName } from '@components/icon/types';
import { UIIconComponent } from '@components/icon/icon.component';
import { UiInfoBlockComponent } from '@components/info-block/info-block.component';

type TData = {
  icon: IconName;
  title: string;
  text: string;
  color: string[];
};

@Component({
  selector: 'section-networks',
  imports: [UIIconComponent, UiInfoBlockComponent],
  templateUrl: './networks.component.html',
  styleUrl: './networks.component.scss',
  standalone: true,
})
export class NetworksSectionComponent {
  private scroll = inject(ScrollService);
  readonly data: TData[] = [
    {
      title: 'Ethereum',
      text: 'The most secure and liquid EVM network.',
      icon: 'ethereumChain',
      color: ['#627EEA', '#627EEA99'],
    },
    {
      title: 'Binance Smart Chain',
      text: 'High throughput and low fees for retail-friendly dApps.',
      icon: 'binanceChain',
      color: ['#F3BA2F', '#F3BA2F99'],
    },
    {
      title: 'Polygon PoS',
      text: 'Low-cost transactions with a massive ecosystem.',
      icon: 'polygonChain',
      color: ['#8247E5', '#8247E599'],
    },
    {
      title: 'Avalanche',
      text: 'Fast finality and EVM compatibility on the C-Chain.',
      icon: 'avalancheChain',
      color: ['#E84142', '#E8414299'],
    },
    {
      title: 'Gnosis',
      text: 'Low-cost EVM chain for payments, DAOs and everyday dApps.',
      icon: 'gnosisChain',
      color: ['#04795B', '#04795B99'],
    },
    {
      title: 'Arbitrum',
      text: 'Scalable L2 with deep DeFi liquidity and tooling.',
      icon: 'arbitrumChain',
      color: ['#28A0F0', '#28A0F099'],
    },
    {
      title: 'Optimism',
      text: 'EVM-equivalent L2 focused on simplicity and speed.',
      icon: 'optimismChain',
      color: ['#FF0420', '#FF042099'],
    },
    {
      title: 'Base',
      text: 'Coinbase-backed L2 with growing mainstream reach.',
      icon: 'baseChain',
      color: ['#0052FF', '#0052FF99'],
    },
    {
      title: 'Linea',
      text: 'Consensys zkEVM with strong developer tooling.',
      icon: 'lineaChain',
      color: ['#0B5CFF', '#0B5CFF99'],
    },
    // {
    //   title: 'zkSync Era',
    //   text: 'ZK rollup for fast, inexpensive transactions.',
    //   icon: 'eraChain',
    //   color: ['#8C8DFC', '#8C8DFC99'],
    // },
    {
      title: 'Scroll',
      text: 'ZK-EVM designed for native Ethereum experience.',
      icon: 'scrollChain',
      color: ['#FFE01B', '#FFE01B99'],
    },
    // {
    //   title: 'Cardano',
    //   text: 'EVM sidechain to interact with Cardano ecosystems.',
    //   icon: 'cardanoChain',
    //   color: ['#0033AD', '#0033AD99'],
    // },
    // {
    //   title: 'Tron',
    //   text: 'Solidity-friendly environment with its own wallet and SDK.',
    //   icon: 'tronChain',
    //   color: ['#EB0029', '#EB002999'],
    // },
  ];

  readonly opened = signal<number>(0);
  private readonly STEP = 4;

  readonly visibleCount = signal<number>(Math.min(this.STEP, this.data.length));

  readonly allVisible = computed(() => this.visibleCount() >= this.data.length);

  showMore() {
    const next = this.visibleCount() + this.STEP;
    this.visibleCount.set(Math.min(next, this.data.length));
  }

  hideExtra() {
    this.visibleCount.set(Math.min(this.STEP, this.data.length));
    this.opened.set(0);
  }

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
