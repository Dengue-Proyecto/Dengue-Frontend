import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterComponent} from './register.component';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';



@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
