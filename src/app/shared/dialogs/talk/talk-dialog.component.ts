import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { injectDialogRef, NgpDialog, NgpDialogOverlay } from 'ng-primitives/dialog';

import { BaseFormModel } from '@models/base-form.model';
import { UIIconComponent } from '@components/icon/icon.component';
import { IOrderFormControls } from '@interfaces/form.interfaces';

import { ComboboxComponent } from '@kit/combobox.component';
import { InputComponent } from '@kit/input.component';
import { RadioGroupComponent } from '@kit/radio/radio-group.component';
import { RadioItemComponent } from '@kit/radio/radio-item.component';
import { TextareaComponent } from '@kit/textarea.component';

@Component({
  selector: 'ui-dialog-talk',
  standalone: true,
  imports: [
    NgpDialog,
    NgpDialogOverlay,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    RadioGroupComponent,
    RadioItemComponent,
    ComboboxComponent,
    UIIconComponent,
  ],
  templateUrl: './talk-dialog.component.html',
  styleUrl: './talk-dialog.component.scss',
})
export class TalkDialog extends BaseFormModel<IOrderFormControls> {
  protected readonly dialogRef = injectDialogRef<string>();

  protected override formFactory = this.formService.createOrderForm({
    type: 'letstalk',
    formatContact: 'telegram',
    tier: null,
    price: null,
    estimate: null,
  });

  close() {
    this.dialogRef.close();
  }
}
