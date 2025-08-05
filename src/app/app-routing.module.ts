import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FormComponent} from './features/form/form.component';
import {ResultComponent} from './features/result/result.component';
import {LandingComponent} from './features/landing/landing.component';
import {Result1Component} from './features/result1/result1.component';
import {RegisterComponent} from './features/register/register.component';
import {LoginComponent} from './features/login/login.component';
import {EvaluationsComponent} from './features/evaluations/evaluations.component';
import {authGuard} from './core/auth/auth.guard';


const routes: Routes = [
  { path: 'inicio', component: LandingComponent },
  { path: 'formulario', component: FormComponent, canActivate: [authGuard] },
  { path: 'resultado', component: ResultComponent, canActivate: [authGuard] },
  { path: 'resultado1', component: Result1Component, canActivate: [authGuard] },
  { path: 'registro', component: RegisterComponent },
  { path: 'iniciar', component: LoginComponent },
  { path: 'evaluaciones', component: EvaluationsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
