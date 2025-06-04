import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EvaluationsComponent} from './evaluations.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [EvaluationsComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [EvaluationsComponent]
})
export class EvaluationsModule { }
