import { Component } from '@angular/core';
import { UIIconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'main-header',
  imports: [UIIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderMainComponent {}
