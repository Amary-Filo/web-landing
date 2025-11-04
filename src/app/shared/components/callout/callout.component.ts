import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-callout',
  standalone: true,
  templateUrl: './callout.component.html',
  styleUrl: './callout.component.scss',
})
export class UICalloutComponent {
  text = input<string>();
}
