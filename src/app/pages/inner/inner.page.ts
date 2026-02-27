import { Component } from '@angular/core';
import { FooterMainComponent } from '../main/components';
import { RouterOutlet } from '@angular/router';
import { UiArrowLineComponent } from '@app/shared/components/arrow-line/arrow-line.component';
import { HeaderInnerComponent } from './components/header/header.component';

@Component({
  selector: 'page-inner',
  imports: [FooterMainComponent, HeaderInnerComponent, RouterOutlet, UiArrowLineComponent],
  templateUrl: './inner.page.html',
  styleUrl: './inner.page.scss',
  standalone: true,
})
export class InnerPage {}
