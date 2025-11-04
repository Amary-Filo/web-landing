import { Component } from '@angular/core';
import { IconName } from '../../../../shared/components/icon/types';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { UICalloutComponent } from '../../../../shared/components/callout/callout.component';

type TData = {
  title: string;
  text: string;
  icon: IconName;
};

@Component({
  selector: 'section-offer',
  imports: [UIIconComponent, UICalloutComponent],
  templateUrl: './offer.component.html',
  styleUrl: './offer.component.scss',
})
export class OfferSectionComponent {
  readonly data: TData[] = [
    {
      title: 'Web3 onboarding',
      text: 'Painless connection of popular wallets',
      icon: 'wallet3Fill',
    },
    {
      title: 'Multi-chain EVM',
      text: 'Switching networks and contract addresses for a single user',
      icon: 'stackFill2',
    },
    {
      title: 'Chains support',
      text: 'Mainnet/testnet support, unified UX',
      icon: 'apps2AiFill',
    },
    {
      title: 'Implementation',
      text: 'Integration with your APIs/backend',
      icon: 'commandLine',
    },
    {
      title: 'Fiat and crypto',
      text: 'Quotes and rates from reliable providers',
      icon: 'copperCoinFill',
    },
    {
      title: 'SEO',
      text: 'Basic SEO and analytics (GA + UTM)',
      icon: 'menuSearchLine',
    },
    {
      title: 'Translate',
      text: 'Multi-language (i18n) with country adapt',
      icon: 'earthFill',
    },
    {
      title: 'PWA',
      text: 'Install web interface as application',
      icon: 'puzzleFill',
    },
    {
      title: 'UI Kit',
      text: 'Library of proven UI blocks for your brand',
      icon: 'shapesFill',
    },
    {
      title: 'Adaptation',
      text: 'Mobile and tablet adaptation',
      icon: 'layout4Fill',
    },
  ];
}
