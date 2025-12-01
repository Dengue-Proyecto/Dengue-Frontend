import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { EcoTipComponent } from './components/eco-tip/eco-tip.component';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    FeedbackComponent,
    EcoTipComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgOptimizedImage
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    FeedbackComponent,
    EcoTipComponent
  ]
})
export class SharedModule { }
