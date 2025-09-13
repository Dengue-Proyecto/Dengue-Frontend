import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
// Core module
import { CoreModule } from './core/core.module';
// Feature modules
import { FormModule } from './features/form/form.module';
import { RegisterModule } from './features/register/register.module';
import { LoginModule } from './features/login/login.module';
import { LandingModule } from './features/landing/landing.module';
import { ResultModule } from './features/result/result.module';
import { Result1Module } from './features/result1/result1.module';
import { EvaluationsModule } from './features/evaluations/evaluations.module';
// Shared module
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    CommonModule,
    // Core module (singleton services)
    CoreModule,
    // Feature modules
    FormModule,
    RegisterModule,
    LoginModule,
    LandingModule,
    ResultModule,
    Result1Module,
    EvaluationsModule,
    // Shared module
    SharedModule,
    // Third party modules
    MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
