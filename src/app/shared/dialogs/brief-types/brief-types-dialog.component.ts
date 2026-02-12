import { Component } from '@angular/core';
import { injectDialogRef, NgpDialog, NgpDialogOverlay } from 'ng-primitives/dialog';

import { UIIconComponent } from '@components/icon/icon.component';

type TData = {
  title: string;
  text: string;
  about: string;
  from: string;
  estimate: string;
  benefits: string[];
  color: string;
};

@Component({
  selector: 'ui-dialog-talk',
  standalone: true,
  imports: [NgpDialog, NgpDialogOverlay, UIIconComponent],
  templateUrl: './brief-types-dialog.component.html',
  styleUrl: './brief-types-dialog.component.scss',
})
export class BriefTypesDialog {
  protected readonly dialogRef = injectDialogRef<string>();

  readonly data: TData[] = [
    {
      title: 'Proof of concept',
      text: 'Launch a clickable Web3 interface fast, with clear scope and weekly demos.',
      about:
        'Launch a clickable Web3 interface fast, with clear scope and weekly demos. Launch a clickable Web3 interface fast, with clear scope and weekly demos.',
      from: '6.5k',
      estimate: '2-4',
      color: 'aqua-1',
      benefits: [
        '1 Networks',
        '1 Contract',
        '2 Pages',
        'SEO: Basic',
        'UI Kit: Basic',
        'Design: Basic',
      ],
    },
    {
      title: 'Minimal viable product',
      text: 'The sweet spot for real users—modular features, API wiring, and calm UX.',
      about:
        'The sweet spot for real users—modular features, API wiring, and calm UX. The sweet spot for real users—modular features, API wiring, and calm UX.',
      from: '10k',
      estimate: '3-5',
      color: 'purple-5',
      benefits: [
        '2+ Networks',
        '1+ Contracts',
        '2+ Pages',
        'SEO: Basic',
        'TX Flow: Modal/Toast',
        'UI Kit: Full',
        'Branding',
        'Design: Full Kit',
      ],
    },
  ];

  close() {
    this.dialogRef.close();
  }
}
