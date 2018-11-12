import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent ,AddCompany,DeleteDialog} from './company/company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from "./company.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { ValidErrModule } from "../valid-err/valid-err.module";
import { TranslateService, TranslateModule } from "ng2-translate";
import {MdNativeDateModule} from '@angular/material';
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    TranslateModule,
    MaterialModule,YnModule
  ],
  exports : [CompanyComponent,TranslateModule,ValidErrModule,DeleteDialog],
  declarations: [CompanyComponent,DeleteDialog],
  providers: [
    { provide: CompanyService, useClass: CompanyService },
    { provide: ExcelService, useClass: ExcelService },
    TranslateService,
    AuthenticationService
  ],
  entryComponents: [AddCompany,DeleteDialog]
})
export class CompanyModule { }
