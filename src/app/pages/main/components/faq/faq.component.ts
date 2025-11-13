import { Component, computed, signal } from '@angular/core';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';
import { UiFormQuestionComponent } from '../../../../shared/forms/question/question.component';

type TData = {
  title: string;
  text: string;
};

@Component({
  selector: 'section-faq',
  imports: [UIIconComponent, UiFormQuestionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
  standalone: true,
})
export class FaqSectionComponent {
  readonly data: TData[] = [
    {
      title: 'Do you write smart contracts?',
      text: 'Yes — for prototypes we can cover simple contracts, but for production we focus on frontend, integrations, UX flows and security best practices.',
    },
    {
      title: 'What payment methods do you accept?',
      text: 'Bank transfer, crypto (USDT/USDC), card payments or invoices through EU billing — choose whichever is convenient.',
    },
    {
      title: 'How long does a full project take?',
      text: 'MVP takes 2–4 weeks, production-level products take 1–3 months depending on complexity and integrations.',
    },
    {
      title: 'Do you work with audits?',
      text: 'We cooperate with independent audit teams. We prepare the frontend, integration layer and make the codebase audit-friendly.',
    },
    {
      title: 'Is the code private?',
      text: 'Yes — everything is delivered to your GitHub or private repo. We do not reuse or publish client code.',
    },
    {
      title: 'Which languages and technologies do you use?',
      text: 'Angular, TypeScript, Node, GraphQL, Web3.js, Ethers, REST APIs, SSR, Signals, modular architecture and clean scalable structure.',
    },
    {
      title: 'How do you handle IVA / VAT?',
      text: 'EU clients receive invoices with IVA/VAT according to regulations. International clients receive export invoices without VAT.',
    },
    {
      title: 'Do you support multi-chain integrations?',
      text: 'Yes — EVM, Solana, LayerZero, cross-chain bridges, staking dashboards, token tools and more.',
    },
    {
      title: 'Can you upgrade an existing project?',
      text: 'Yes — we can refactor, fix architecture, improve UX/UI and migrate to a modern tech stack without breaking production.',
    },
    {
      title: 'Do you provide UI/UX design?',
      text: 'Yes — we create clean, modern, minimalistic UI based on Figma layouts or build a design system from scratch.',
    },
    {
      title: 'What about hosting and deployment?',
      text: 'We prepare CI/CD, deploy to Vercel, Netlify, AWS, Google Cloud, as well as self-hosted setups if required.',
    },
    {
      title: 'Do you offer support and maintenance?',
      text: 'Yes — monthly support plans cover monitoring, updates, performance improvements and small feature requests.',
    },
    {
      title: 'Can you develop browser extensions?',
      text: 'Yes — Chrome/Edge extensions for DeFi dashboards, Web3 wallets, token tools and automation scripts.',
    },
    {
      title: 'What if I don’t have a full technical specification?',
      text: 'We help structure the idea, prepare the scope, features, milestones and turn it into a clear step-by-step plan.',
    },
    {
      title: 'Do you handle analytics and tracking?',
      text: 'Yes — Google Analytics, PostHog, Hotjar, blockchain event analytics and custom dashboards.',
    },
    {
      title: 'Do you offer white-label solutions?',
      text: 'Yes — DEX dashboards, staking platforms, token tools, NFT modules and reusable UI libraries.',
    },
    {
      title: 'Can you integrate external APIs?',
      text: 'Yes — banking APIs, crypto providers, oracles, payment systems, messaging services, or custom backend endpoints.',
    },
    {
      title: 'Do you build admin panels or dashboards?',
      text: 'Yes — clean, scalable admin dashboards with charts, analytics, roles, permissions and real-time updates.',
    },
    {
      title: 'How do we communicate during the project?',
      text: 'Telegram, Slack or email. Weekly syncs, day-to-day updates and milestone reviews depending on your workflow.',
    },
    {
      title: 'Do you sign NDA?',
      text: 'Yes — by default. All project details, repositories and internal documents remain private.',
    },
  ];

  readonly opened = signal<number>(0);

  private readonly STEP = 5;

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
}
