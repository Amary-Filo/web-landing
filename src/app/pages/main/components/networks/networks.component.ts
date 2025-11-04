import { Component, computed, model, signal } from '@angular/core';
import { IconName } from '../../../../shared/components/icon/types';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { UiInfoBlockComponent } from '../../../../shared/components/info-block/info-block.component';

type TChip = 'fees' | 'eco' | 'fast' | 'popular' | 'security' | 'large' | 'lz';
type TLayer = 'layer-1' | 'layer-2' | 'layer-3' | 'other';
type TData = {
  layer: TLayer;
  icon: IconName;
  title: string;
  text: string;
  chain: string;
  chips: TChip[];
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
  readonly chips: Record<TChip, string> = {
    eco: 'Broad ecosystem',
    popular: 'Popular',
    security: 'High security',
    fees: 'Low fees',
    fast: 'Fast finality',
    large: 'Large user base',
    lz: 'L2 (ZK)',
  };
  readonly colorChip: Record<TChip, string> = {
    eco: 'green-1',
    popular: 'blue-1',
    security: 'pink-1',
    fees: 'orange-1',
    fast: 'purple-2',
    large: 'purple-1',
    lz: 'blue-2',
  };

  private readonly data: TData[] = [
    {
      layer: 'layer-1',
      title: 'Ethereum',
      text: 'The most secure and liquid EVM network.',
      icon: 'ethereumChain',
      chain: '1',
      chips: ['popular', 'security'],
      color: ['#627EEA', '#627EEA99'],
    },
    {
      layer: 'layer-1',
      title: 'Binance Smart Chain',
      text: 'High throughput and low fees for retail-friendly dApps.',
      icon: 'binanceChain',
      chain: '56',
      chips: ['fees', 'large'],
      color: ['#F3BA2F', '#F3BA2F99'],
    },
    {
      layer: 'layer-1',
      title: 'Polygon PoS',
      text: 'Low-cost transactions with a massive ecosystem.',
      icon: 'polygonChain',
      chain: '137',
      chips: ['fees', 'eco'],
      color: ['#8247E5', '#8247E599'],
    },
    {
      layer: 'layer-1',
      title: 'Avalanche',
      text: 'Fast finality and EVM compatibility on the C-Chain.',
      icon: 'avalancheChain',
      chain: '43114',
      chips: ['fast'],
      color: ['#E84142', '#E8414299'],
    },
    {
      layer: 'layer-1',
      title: 'Gnosis',
      text: 'Low-cost EVM chain for payments, DAOs and everyday dApps.',
      icon: 'gnosisChain',
      chain: '100',
      chips: ['fees'],
      color: ['#04795B', '#04795B99'],
    },
    {
      layer: 'layer-2',
      title: 'Arbitrum',
      text: 'Scalable L2 with deep DeFi liquidity and tooling.',
      icon: 'arbitrumChain',
      chain: '42161',
      chips: ['popular', 'security'],
      color: ['#28A0F0', '#28A0F099'],
    },
    {
      layer: 'layer-2',
      title: 'Optimism',
      text: 'EVM-equivalent L2 focused on simplicity and speed.',
      icon: 'optimismChain',
      chain: '10',
      chips: ['fees', 'large'],
      color: ['#FF0420', '#FF042099'],
    },
    {
      layer: 'layer-2',
      title: 'Base',
      text: 'Coinbase-backed L2 with growing mainstream reach.',
      icon: 'baseChain',
      chain: '8453',
      chips: ['fees', 'eco'],
      color: ['#0052FF', '#0052FF99'],
    },
    {
      layer: 'layer-2',
      title: 'Linea',
      text: 'Consensys zkEVM with strong developer tooling.',
      icon: 'lineaChain',
      chain: '59144',
      chips: ['lz'],
      color: ['#0B5CFF', '#0B5CFF99'],
    },
    {
      layer: 'layer-2',
      title: 'zkSync Era',
      text: 'ZK rollup for fast, inexpensive transactions.',
      icon: 'eraChain',
      chain: '324',
      chips: ['fees', 'lz'],
      color: ['#8C8DFC', '#8C8DFC99'],
    },
    {
      layer: 'layer-2',
      title: 'Scroll',
      text: 'ZK-EVM designed for native Ethereum experience.',
      icon: 'scrollChain',
      chain: '534352',
      chips: ['lz'],
      color: ['#FFE01B', '#FFE01B99'],
    },
    {
      layer: 'other',
      title: 'Cardano',
      text: 'EVM sidechain to interact with Cardano ecosystems.',
      icon: 'cardanoChain',
      chain: '2001',
      chips: ['fast'],
      color: ['#0033AD', '#0033AD99'],
    },
    {
      layer: 'other',
      title: 'Tron',
      text: 'Solidity-friendly environment with its own wallet and SDK.',
      icon: 'tronChain',
      chain: '728126428',
      chips: ['fees', 'eco'],
      color: ['#EB0029', '#EB002999'],
    },
  ];
  readonly tab = signal<TLayer>('layer-1');
  readonly tabs = computed<TLayer[]>(() => Array.from(new Set(this.data.map((i) => i.layer))));
  readonly dataFiltered = computed(() => this.data.filter((i) => i.layer === this.tab()));

  btnClick() {
    console.log('Click');
  }
}
