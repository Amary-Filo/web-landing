import { Component } from '@angular/core';
import {
  HeaderMainComponent,
  HeroSectionComponent,
  OfferSectionComponent,
  AboutSectionComponent,
  NetworksSectionComponent,
  SolutionsSectionComponent,
  WhyChooseSectionComponent,
  ProcessSectionComponent,
  CreateProjectSectionComponent,
  FaqSectionComponent,
  FooterMainComponent,
} from './components';
import { UiArrowLineComponent } from '../../shared/components/arrow-line/arrow-line.component';

@Component({
  selector: 'page-main',
  imports: [
    HeaderMainComponent,
    HeroSectionComponent,
    SolutionsSectionComponent,
    AboutSectionComponent,
    OfferSectionComponent,
    NetworksSectionComponent,
    WhyChooseSectionComponent,
    ProcessSectionComponent,
    CreateProjectSectionComponent,
    FaqSectionComponent,
    FooterMainComponent,
    UiArrowLineComponent,
  ],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
  standalone: true,
})
export class MainPage {}
