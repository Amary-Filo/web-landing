import { Component } from '@angular/core';
import {
  HeaderMainComponent,
  HeroSectionComponent,
  // OfferSectionComponent,
  AboutSectionComponent,
  NetworksSectionComponent,
  SolutionsSectionComponent,
  // WhyChooseSectionComponent,
  ProcessSectionComponent,
  CreateProjectSectionComponent,
  FaqSectionComponent,
  FooterMainComponent,
} from './components';
import { UiArrowLineComponent } from '@components/arrow-line/arrow-line.component';
import { StackToolsSectionComponent } from './components/stack-tools/stack-tools.component';
import { ComparisonSectionComponent } from './components/comparison/comparison.component';
import { BannerSectionComponent } from './components/banner/banner.component';
import { BenefitsSectionComponent } from './components/benefits/benefits.component';
// import { Hero2SectionComponent } from './components/hero-2/hero.component';
import { ProductSectionComponent } from './components/product/product.component';

@Component({
  selector: 'page-main',
  imports: [
    HeaderMainComponent,
    HeroSectionComponent,
    SolutionsSectionComponent,
    AboutSectionComponent,
    ComparisonSectionComponent,
    // OfferSectionComponent,
    NetworksSectionComponent,
    // WhyChooseSectionComponent,
    ProcessSectionComponent,
    CreateProjectSectionComponent,
    FaqSectionComponent,
    FooterMainComponent,
    UiArrowLineComponent,
    StackToolsSectionComponent,
    BannerSectionComponent,
    BenefitsSectionComponent,
    // Hero2SectionComponent,
    ProductSectionComponent,
  ],
  templateUrl: './main.page.html',
  styleUrl: './main.page.scss',
  standalone: true,
})
export class MainPage {}
