import { Component, input, output } from '@angular/core';
import { FlickerDirective } from '../../directives/flicker.directive';

@Component({
  selector: 'ui-form-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [FlickerDirective],
})
export class UiFormOrderComponent {
  color = input<string>('#fe70a1');
  gradient = input<string>('pink-1');
  price = input<string>('10000');
  estimate = input<string>('4+');
  isSend = input<boolean>(false);
  btnClick = output<void>();
}
