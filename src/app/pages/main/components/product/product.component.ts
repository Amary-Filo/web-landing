import { Component } from '@angular/core';
import { UIIconComponent } from '@app/shared/components/icon/icon.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { IconName } from '@app/shared/components/icon/types';

export interface IProduct {
  color: string;
  badge: string;
  icon: IconName;
  title: string;
  subtitle: string;
  text: string;
  img: string;
  imgAlt: string;
}

export type IData = IProduct & { features: string[]; reverse?: boolean; reverseTitle?: boolean };

@Component({
  selector: 'section-product',
  imports: [UIIconComponent, ProductItemComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  standalone: true,
})
export class ProductSectionComponent {
  readonly data: IData[] = [
    {
      color: 'pink-3',
      badge: 'Fast demo',
      icon: 'spaceShipFill',
      title: 'in real wallets <br />within days',
      subtitle: 'See your product working',
      text: 'We set up your project with real networks, wallets and contracts logic — so you can interact with your product exactly like your users will.',
      img: 'media.png',
      imgAlt: 'See your product working in real wallets within days',
      features: [
        'Connect Wallets',
        'Desktop & mobile',
        'Real token balances',
        'Contract actions',
        'Branded UI',
      ],
    },
    {
      reverse: true,
      reverseTitle: true,
      color: 'purple-4',
      badge: 'Scalable by design',
      icon: 'dragMove2Fill',
      title: 'Built to grow',
      subtitle: 'not to be thrown away <br />after demo',
      text: 'Your PoC or MVP is not a dead end. It’s a foundation that can be extended with new features, pages, networks and contracts.',
      img: 'media.png',
      imgAlt: 'Built to grow not to be thrown away after demo',
      features: [
        'Extend functionality',
        'Add pages, flows, integrations',
        'Replace contracts',
        'Development after launch',
      ],
    },
    {
      reverseTitle: true,
      color: 'yellow-4',
      badge: 'Product-first',
      icon: 'shapesFill',
      title: 'design <br />the product logic',
      subtitle: 'not just screens',
      text: 'You describe your idea. We turn it into a clear user flow, screens,and interactions that make sense to real users.',
      img: 'media.png',
      imgAlt: 'Design the product logic not just screens',
      features: [
        'User flows',
        'Screens mapping',
        'Figma UI kit',
        'Clear scope',
        'Feature breakdown',
        'Structured SOW',
      ],
    },
  ];

  itemImgSrc = (item: string) => `./assets/img/${item}`;
  itemColorClass = (item: string) => `cl-g-${item}`;

  readonly products: IProduct[] = [
    {
      color: 'peach-1',
      badge: 'Design & UI Kit',
      icon: 'brushFill',
      title: 'Design that <br />already works',
      subtitle: 'everywhere',
      text: 'Responsive layouts, ready sections and components — no guessing how itshould look on mobile.',
      img: 'media.png',
      imgAlt: 'Design that already works everywhere',
    },
    {
      color: 'aqua-1',
      badge: 'Wallets & Networks',
      icon: 'walletFill',
      title: 'Connect real <br />wallets',
      subtitle: 'on real networks',
      text: 'MetaMask, WalletConnect, injected wallets. Single or multichain — your users connect the way they expect.',
      img: 'media.png',
      imgAlt: 'Connect real wallets on real networks',
    },
    {
      color: 'purple-5',
      badge: 'Transactions UX',
      icon: 'arrowLeftRightFill',
      title: 'Clear <br />transaction',
      subtitle: 'flow for users',
      text: 'Users always understand what they sign, send or approve — no confusion, no scary popups.',
      img: 'media.png',
      imgAlt: 'Clear transaction flow for users',
    },

    {
      color: 'blue-5',
      badge: 'Translations & Theming',
      icon: 'colorFilterFill',
      title: 'Multi-language <br />& theming',
      subtitle: 'ready',
      text: 'Add languages, light/dark themes or custom styles without rebuilding the UI.',
      img: 'media.png',
      imgAlt: 'Ready multi-language & theming',
    },
    {
      color: 'red-5',
      badge: 'Analytics & Errors',
      icon: 'testTubeFill',
      title: 'Built-in error <br />and analytics',
      subtitle: 'tracking',
      text: 'Know how users behave. See errors instantly. No waiting weeks to “add it later”.',
      img: 'media.png',
      imgAlt: 'Built-in error and analytics tracking',
    },
    {
      color: 'green-5',
      badge: 'SEO & Performance',
      icon: 'searchFill',
      title: 'Optimized from <br />day one',
      subtitle: 'for browsers',
      text: 'SEO-friendly structure, fast loading and clean markup — even for crypto products.',
      img: 'media.png',
      imgAlt: 'Optimized from day one for browsers',
    },
  ];
}
