import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule,BaseRequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from "ng2-translate";
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,TranslateModule,
    MaterialModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent,TranslateModule]
})
export class LoginModule { }
