import { Component } from '@angular/core';
import { UICalloutComponent } from '../../../../shared/components/callout/callout.component';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'main-footer',
  imports: [UICalloutComponent, UIIconComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterMainComponent {}
