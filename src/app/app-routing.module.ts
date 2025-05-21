import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from './form/form.component';
import {ResultComponent} from './result/result.component';
import {LandingComponent} from './landing/landing.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'form', component: FormComponent },
  { path: 'result', component: ResultComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
