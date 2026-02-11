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

@Component({
  selector: 'section-product',
  imports: [UIIconComponent, ProductItemComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  standalone: true,
})
export class ProductSectionComponent {
  readonly products: IProduct[] = [
    {
      color: 'pink-1',
      badge: 'Design & UI Kit',
      icon: 'checkLine',
      title: 'Design that <br />already works',
      subtitle: 'everywhere',
      text: 'Responsive layouts, ready sections and components — no guessing how itshould look on mobile.',
      img: 'media.png',
      imgAlt: 'Design that already works everywhere',
    },
    {
      color: 'purple-1',
      badge: 'Wallets & Networks',
      icon: 'checkLine',
      title: 'Connect real <br />wallets',
      subtitle: 'on real networks',
      text: 'MetaMask, WalletConnect, injected wallets. Single or multichain — your users connect the way they expect.',
      img: 'media.png',
      imgAlt: 'Connect real wallets on real networks',
    },
    {
      color: 'green-1',
      badge: 'Transactions UX',
      icon: 'checkLine',
      title: 'Clear <br />transaction',
      subtitle: 'flow for users',
      text: 'Users always understand what they sign, send or approve — no confusion, no scary popups.',
      img: 'media.png',
      imgAlt: 'Clear transaction flow for users',
    },

    {
      color: 'orange-1',
      badge: 'Translations & Theming',
      icon: 'checkLine',
      title: 'Multi-language <br />& theming',
      subtitle: 'ready',
      text: 'Add languages, light/dark themes or custom styles without rebuilding the UI.',
      img: 'media.png',
      imgAlt: 'Ready multi-language & theming',
    },
    {
      color: 'blue-1',
      badge: 'Analytics & Errors',
      icon: 'checkLine',
      title: 'Built-in error <br />and analytics',
      subtitle: 'tracking',
      text: 'Know how users behave. See errors instantly. No waiting weeks to “add it later”.',
      img: 'media.png',
      imgAlt: 'Built-in error and analytics tracking',
    },
    {
      color: 'pink-2',
      badge: 'SEO & Performance',
      icon: 'checkLine',
      title: 'Optimized from <br />day one',
      subtitle: 'for browsers',
      text: 'SEO-friendly structure, fast loading and clean markup — even for crypto products.',
      img: 'media.png',
      imgAlt: 'Optimized from day one for browsers',
    },
  ];
}
