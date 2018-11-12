import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpPermissonComponent } from './ip-permisson/ip-permisson.component';
import { AddIpComponent } from './add-ip/add-ip.component';
import { DeleteIpComponent } from './delete-ip/delete-ip.component';
import { ActiveIpComponent } from './active-ip/active-ip.component';
import { KeysPipe } from '../agent/report/report.component';
import { MomentModule } from 'angular2-moment';
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { TranslateModule } from 'ng2-translate';
import { RouterModule } from '@angular/router';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IpPermissonService } from './ip-permisson.service';
import { AuthenticationService } from '../login/authentication.service';
import { LocalStorageService } from '../local-storage.service';
import { UsersService } from '../users/users.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    RouterModule,
    TranslateModule,
    YnModule,
    MaterialModule,
    MomentModule
  ],
  exports:[
  ],
  declarations: [
    IpPermissonComponent, 
    AddIpComponent, 
    DeleteIpComponent, 
    ActiveIpComponent
  ],
  entryComponents: [
    IpPermissonComponent, 
    AddIpComponent, 
    DeleteIpComponent, 
    ActiveIpComponent
  ],
  providers: [
    { provide: IpPermissonService, useClass: IpPermissonService },
    { provide: UsersService, useClass: UsersService },
     AuthenticationService,
     LocalStorageService
  ]
})
export class IpPermissionModule { }
