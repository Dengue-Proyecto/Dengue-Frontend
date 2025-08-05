import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormModule} from './features/form/form.module';
import { RouterModule } from '@angular/router';
import { ResultComponent } from './features/result/result.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import {NgOptimizedImage} from '@angular/common';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './shared/components/footer/footer.component';
import { LandingComponent } from './features/landing/landing.component';
import { Result1Component } from './features/result1/result1.component';
import {RegisterModule} from './features/register/register.module';
import { LoginComponent } from './features/login/login.component';
import {AuthInterceptor} from './core/auth/auth.interceptor';
import {EvaluationsModule} from './features/evaluations/evaluations.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LandingComponent,
    ResultComponent,
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
    FormsModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
