import { Component, computed, inject, signal } from '@angular/core';

import { ScrollService } from '@services/scroll.service';
import { TTiers } from '@interfaces/form.interfaces';

import { UiFormOrderComponent } from '@forms/order/order.component';
import { UICalloutComponent } from '@components/callout/callout.component';
import { BriefTypesDialog } from '@app/shared/dialogs/brief-types/brief-types-dialog.component';
import { NgpDialogManager } from 'ng-primitives/dialog';

type TData = {
  title: string;
  text: string;
  tier: TTiers;
  from: string;
  estimate: string;
  color: string;
};

@Component({
  selector: 'section-create-project',
  imports: [UICalloutComponent, UiFormOrderComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
  standalone: true,
})
export class CreateProjectSectionComponent {
  private scroll = inject(ScrollService);
  private dialogManager = inject(NgpDialogManager);

  readonly data: TData[] = [
    {
      title: 'Proof of concept',
      tier: 'poc',
      text: 'Launch a clickable Web3 interface fast, with clear scope and weekly demos.',
      from: '6.5k',
      estimate: '2-4',
      color: 'aqua-1',
    },
    {
      title: 'Minimal viable product',
      tier: 'mvp',
      text: 'The sweet spot for real users—modular features, API wiring, and calm UX.',
      from: '10k',
      estimate: '3-5',
      color: 'purple-5',
    },
  ];

  readonly selected = signal<number>(0);
  readonly formData = computed<TData>(() => this.data[this.selected()]);

  openDialog() {
    this.dialogManager.open(BriefTypesDialog);
  }

  goTo(id: string) {
    this.scroll.scrollTo(id);
  }
}
