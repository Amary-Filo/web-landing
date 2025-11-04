import { Component, signal } from '@angular/core';
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
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'Payment and currency?',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'How long does it take?',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'Is an audit required?',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'Private code?',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'Languages?',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
    {
      title: 'IVA, VAT',
      text: 'For production — recommended (we cover frontend/UX/integrations).',
    },
  ];

  readonly opened = signal<number>(0);
}
