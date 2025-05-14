import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {FormModule} from './form/form.module';
import { RouterModule } from '@angular/router';
import { ResultComponent } from './result/result.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import {NgOptimizedImage} from '@angular/common';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ResultComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormModule,
    RouterModule,
    HttpClientModule,
    NgOptimizedImage,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
