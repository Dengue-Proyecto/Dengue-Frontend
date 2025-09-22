import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Result1Component } from './result1.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [Result1Component],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [Result1Component]
})
export class Result1Module { }
