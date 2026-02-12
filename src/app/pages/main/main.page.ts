import { Component } from '@angular/core';
import {
  HeaderMainComponent,
  HeroSectionComponent,
  BenefitsSectionComponent,
  ProductSectionComponent,
  SmartContractsSectionComponent,
  AboutSectionComponent,
  ComparisonSectionComponent,
  ShowcaseSectionComponent,
  NetworksSectionComponent,
  ProcessSectionComponent,
  CreateProjectSectionComponent,
  FaqSectionComponent,
  StackToolsSectionComponent,
  BannerSectionComponent,
  FooterMainComponent,
} from './components';
import { UiArrowLineComponent } from '@components/arrow-line/arrow-line.component';

@Component({
  selector: 'page-main',
  imports: [
    HeaderMainComponent,
    HeroSectionComponent,
    BenefitsSectionComponent,
    ProductSectionComponent,
    SmartContractsSectionComponent,
    AboutSectionComponent,
    ComparisonSectionComponent,
    ShowcaseSectionComponent,
    NetworksSectionComponent,
    ProcessSectionComponent,
    CreateProjectSectionComponent,
    FaqSectionComponent,
    StackToolsSectionComponent,
    BannerSectionComponent,
    FooterMainComponent,
    UiArrowLineComponent,
  ],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
  standalone: true,
})
export class MainPage {}
