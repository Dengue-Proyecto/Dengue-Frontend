import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormModule} from './form/form.module';
import { RouterModule } from '@angular/router';
import { ResultComponent } from './result/result.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import {NgOptimizedImage} from '@angular/common';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { LandingComponent } from './landing/landing.component';
import { Result1Component } from './result1/result1.component';
import {RegisterModule} from './register/register.module';
import { LoginComponent } from './login/login.component';
import {AuthInterceptor} from './auth.interceptor';
import {EvaluationsModule} from './evaluations/evaluations.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ResultComponent,
    FooterComponent,
    LandingComponent,
    Result1Component,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormModule,
    RegisterModule,
    EvaluationsModule,
    RouterModule,
    HttpClientModule,
    NgOptimizedImage,
    CommonModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
