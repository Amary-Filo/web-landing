import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BaseFormModel } from '@models/base-form.model';
import { IBaseFormControls } from '@interfaces/form.interfaces';

import { InputComponent } from '@kit/input.component';
import { TextareaComponent } from '@kit/textarea.component';

import { UIIconComponent } from '@components/icon/icon.component';

@Component({
  selector: 'ui-form-question',
  standalone: true,
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputComponent,
    TextareaComponent,
    UIIconComponent,
  ],
})
export class UiFormQuestionComponent extends BaseFormModel<IBaseFormControls> {
  protected override formFactory = this.formService.createQuestionForm({
    type: 'question',
  });
}
