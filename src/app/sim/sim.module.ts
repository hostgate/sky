import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimComponent, DeleteDialog } from './sim/sim.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimService } from './sim.service';
import { EditSimComponent } from './edit-sim/edit-sim.component';
import { AddSimComponent } from './add-sim/add-sim.component';
import { UsersService } from '../users/users.service';
import { CompanyService } from '../company/company.service';
import { Angular2TokenService } from 'angular2-token';
import { YnModule } from '../pipes/yn.module';
import { RouterModule } from '@angular/router';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    ValidErrModule,
    BrowserModule,
    BrowserAnimationsModule,YnModule,RouterModule
    
  ],
  exports:[SimComponent,ValidErrModule,TranslateModule, AddSimComponent, EditSimComponent,DeleteDialog],
  providers:[
      {provide: SimService, useClass: SimService},
      {provide: UsersService, useClass: UsersService},
      {provide: CompanyService, useClass: CompanyService},
      {provide:Angular2TokenService ,useClass:Angular2TokenService },
      { provide: ExcelService, useClass: ExcelService },
      AuthenticationService
    ],
  declarations: [SimComponent, AddSimComponent, EditSimComponent,DeleteDialog],
  entryComponents: [AddSimComponent, EditSimComponent,DeleteDialog]
})
export class SimModule { }
