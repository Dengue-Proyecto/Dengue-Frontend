import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvaluationsComponent} from './evaluations.component';


@NgModule({
  declarations: [EvaluationsComponent],
  imports: [
    CommonModule,
  ],
  exports: [EvaluationsComponent]
})
export class EvaluationsModule { }
