import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage
  ],
  exports: [
    NavbarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
