import { Component, inject } from '@angular/core';
import { ScrollService } from '@services/scroll.service';
import { UICalloutComponent } from '@components/callout/callout.component';

type TData = {
  title: string;
  text: string;
};

@Component({
  selector: 'section-process',
  imports: [UICalloutComponent],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
  standalone: true,
})
export class ProcessSectionComponent {
  private scroll = inject(ScrollService);

  readonly data: TData[] = [
    {
      title: 'Brief',
      text: 'We clarify goals, modules, networks, and references; identify key risks and limitations (30–60 min).',
    },
    {
      title: 'Scope & estimate',
      text: 'We approve the structure of screens and features, timeline, and cost; set boundaries to prevent “spreading” (1–3 days).',
    },
    {
      title: 'Contract',
      text: 'We sign the contract/NDA (upon request) and invoice with IVA/reverse charge terms; we start after 50% prepayment.',
    },
    {
      title: 'Sprints',
      text: 'Open repository and task board, weekly demos; checklist-based edits, no unnecessary animations.',
    },
    {
      title: 'Testing',
      text: 'Functional and multi-chain tests (testnet/mainnet), UX polishing, basic SEO/analytics; UAT acceptance.',
    },
    {
      title: 'release',
      text: 'Deployment, documentation, brief workshop; 7 days of stabilization (bugfix), followed by package support.',
    },
  ];

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
