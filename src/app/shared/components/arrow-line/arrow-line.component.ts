import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-arrow-line',
  standalone: true,
  templateUrl: './arrow-line.component.html',
  styleUrl: './arrow-line.component.scss',
})
export class UiArrowLineComponent {
  width = input<string>('15');
  height = input<string>('52');
  colorStart = input<string>('#ffffff80');
  colorEnd = input<string>('#ffffffff');
  rotate = input<number | string>('0');
}
