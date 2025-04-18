import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from './form/form.component';
import {ResultComponent} from './result/result.component';

const routes: Routes = [
  { path: 'form', component: FormComponent },
  { path: 'result', component: ResultComponent },
  { path: '', redirectTo: '/form', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
