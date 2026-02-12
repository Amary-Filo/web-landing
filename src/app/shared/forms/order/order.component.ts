import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BaseFormModel } from '@models/base-form.model';
import { IOrderFormControls, TTiers } from '@interfaces/form.interfaces';

import { InputComponent } from '@kit/input.component';
import { TextareaComponent } from '@kit/textarea.component';
import { RadioGroupComponent } from '@kit/radio/radio-group.component';
import { RadioItemComponent } from '@kit/radio/radio-item.component';
import { ComboboxComponent } from '@kit/combobox.component';

import { UIIconComponent } from '@components/icon/icon.component';

@Component({
  selector: 'ui-form-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
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
})
export class UiFormOrderComponent extends BaseFormModel<IOrderFormControls> {
  gradient = input<string>('pink-1');
  price = input<string>('10000');
  estimate = input<string>('4+');
  tier = input<TTiers>('poc');
  isSend = input<boolean>(false);

  protected override formFactory = this.formService.createOrderForm({
    type: 'brief',
    formatContact: 'telegram',
    tier: this.tier(),
    price: this.price(),
    estimate: this.estimate(),
  });
}
