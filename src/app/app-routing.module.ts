import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from './form/form.component';
import {ResultComponent} from './result/result.component';
import {LandingComponent} from './landing/landing.component';
import {Result1Component} from './result1/result1.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {EvaluationsComponent} from './evaluations/evaluations.component';


const routes: Routes = [
  { path: 'inicio', component: LandingComponent },
  { path: 'formulario', component: FormComponent },
  { path: 'resultado', component: ResultComponent },
  { path: 'resultado1', component: Result1Component },
  { path: 'registro', component: RegisterComponent },
  { path: 'iniciar', component: LoginComponent },
  { path: 'evaluaciones', component: EvaluationsComponent },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
