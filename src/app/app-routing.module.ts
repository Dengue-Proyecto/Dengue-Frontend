import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from './form/form.component';
import {ResultComponent} from './result/result.component';
import {LandingComponent} from './landing/landing.component';
import {Result1Component} from './result1/result1.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  { path: 'landing', component: LandingComponent },
  { path: 'form', component: FormComponent },
  { path: 'result', component: ResultComponent },
  { path: 'result1', component: Result1Component },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
