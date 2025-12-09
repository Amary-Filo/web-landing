import { Component } from '@angular/core';
import { IconName } from '@components/icon/types';
import { UIIconComponent } from '@components/icon/icon.component';
import { UICalloutComponent } from '@components/callout/callout.component';

type TData = {
  title: string;
  text: string;
  icon: IconName;
  info: {
    video?: string;
    text: string;
  };
};

@Component({
  selector: 'section-offer',
  imports: [UIIconComponent, UICalloutComponent],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss',
})
export class OfferSectionComponent {
  readonly dataProduct: TData[] = [
    {
      title: 'Fast POC (3–7 days)',
      text: 'Clickable UI on top of dev contracts, to validate flows and UX.',
      icon: 'wallet3Fill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Ready-made modules',
      text: 'Staking, auctions, claims, presales, swaps, liquidity, farming — we reuse, adjust and extend instead of reinventing.',
      icon: 'wallet3Fill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Dev contracts + handover',
      text: 'Example contracts for your Solidity developer to use as a starting point; we don’t ship production contracts.',
      icon: 'wallet3Fill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Configurable UI Kit',
      text: 'Tokens for colors, spacing, themes and components. Change branding without rewriting everything.',
      icon: 'wallet3Fill',
      info: {
        video: '',
        text: '',
      },
    },
  ];

  readonly data: TData[] = [
    {
      title: 'Web3 onboarding',
      text: 'Painless connection of popular wallets',
      icon: 'wallet3Fill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Multi-chain EVM',
      text: 'Switching networks and contract addresses for a single user',
      icon: 'stackFill2',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Chains support',
      text: 'Mainnet/testnet support, unified UX',
      icon: 'apps2AiFill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Integration',
      text: 'Implementation with your APIs/backend',
      icon: 'commandLine',
      info: {
        video: '',
        text: 'Connect your backend, KYC/KYB providers, analytics, pricing APIs and more.',
      },
    },
    {
      title: 'Fiat and crypto',
      text: 'Quotes and rates from reliable providers',
      icon: 'copperCoinFill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'SEO',
      text: 'Basic SEO and analytics (GA + UTM)',
      icon: 'menuSearchLine',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Multi-language',
      text: 'Translate (i18n) with country adapt',
      icon: 'earthFill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'PWA',
      text: 'Install web interface as application',
      icon: 'puzzleFill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'UI Kit',
      text: 'Library of proven UI blocks for your brand',
      icon: 'shapesFill',
      info: {
        video: '',
        text: '',
      },
    },
    {
      title: 'Adaptation',
      text: 'Mobile and tablet adaptation',
      icon: 'layout4Fill',
      info: {
        video: '',
        text: '',
      },
    },
  ];
}
