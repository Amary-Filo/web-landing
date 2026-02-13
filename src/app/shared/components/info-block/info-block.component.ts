import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-info-block',
  standalone: true,
  templateUrl: './info-block.component.html',
  styleUrl: './info-block.component.scss',
})
export class UiInfoBlockComponent {
  title = input<string>('Title');
  text = input<string>('Text');
  accent = input<string>();
  btnText = input<string>('Click me!');
  color = input<string>('blue-5');
  width = input<string>('700px');
  bgColor = input<string>('#1f1f2a');
  btnClick = output<void>();
}
