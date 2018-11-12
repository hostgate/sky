import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent ,DeleteDialog} from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from "./users.service";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ValidErrModule } from "../valid-err/valid-err.module";
import { RouterModule, Routes } from '@angular/router';
import { TranslateService, TranslateModule } from "ng2-translate";
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { MomentModule } from 'angular2-moment';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    MaterialModule,
    RouterModule,TranslateModule,YnModule,MomentModule
  ],
  exports : [UsersComponent,AddUserComponent,EditUserComponent,TranslateModule,DeleteDialog],
  declarations: [UsersComponent, AddUserComponent, EditUserComponent,DeleteDialog],
  providers: [
    { provide: UsersService, useClass: UsersService },
    { provide: ExcelService, useClass: ExcelService },
    AuthenticationService
  ],
  entryComponents: [DeleteDialog]
})
export class UsersModule { }
