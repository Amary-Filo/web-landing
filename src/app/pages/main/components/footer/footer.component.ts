import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UICalloutComponent } from '@components/callout/callout.component';
import { UIIconComponent } from '@components/icon/icon.component';

@Component({
  selector: 'main-footer',
  imports: [UICalloutComponent, UIIconComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  standalone: true,
})
export class FooterMainComponent {}
