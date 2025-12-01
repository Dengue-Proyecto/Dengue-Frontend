import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    FeedbackComponent
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
    FeedbackComponent
  ]
})
export class SharedModule { }
