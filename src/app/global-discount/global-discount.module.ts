import { MaterialModule } from '../material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalDiscountComponent, EditDiscount ,AddAllDiscount} from './global-discount/global-discount.component';
import { GlobalDiscountService } from './global-discount.service';
import { MdNativeDateModule } from '@angular/material';
import { TranslateModule } from "ng2-translate";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ValidErrModule } from "../valid-err/valid-err.module";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { YnModule } from '../pipes/yn.module';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    ValidErrModule,
    BrowserModule,
    BrowserAnimationsModule,
    YnModule
  ],
  exports:[
    GlobalDiscountComponent,
    TranslateModule,
    EditDiscount,
    AddAllDiscount,
    ValidErrModule
  ],
  declarations: [
    GlobalDiscountComponent,
    EditDiscount,
    AddAllDiscount
  ],
  providers:[
    {
      provide: GlobalDiscountService, useClass: GlobalDiscountService
    },
    { provide: ExcelService, useClass: ExcelService},
    AuthenticationService
  ],
  entryComponents: [
    EditDiscount,
    AddAllDiscount
  ],
})
export class GlobalDiscountModule { }
