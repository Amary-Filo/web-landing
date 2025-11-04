import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-form-question',
  standalone: true,
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  imports: [],
})
export class UiFormQuestionComponent {
  color = input<string>('#fe70a1');
  gradient = input<string>('pink-1');
  price = input<string>('10000');
  estimate = input<string>('4+');
  isSend = input<boolean>(false);
  btnClick = output<void>();
}
