import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent} from './payment/payment.component';
import { AddComponent } from './add/add.component';
import { UsersService } from '../users/users.service';
import { TranslateService, TranslateModule } from "ng2-translate";
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { RouterModule } from '@angular/router';
import { YnModule } from '../pipes/yn.module';
import { PaymentService } from './payment.service';
import { DeleteComponent } from './delete/delete.component';
import { MomentModule } from 'angular2-moment';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
import { ObligationService } from '../users/obligation.service';
import { LocalStorageService } from '../local-storage.service';
// import { ObligationComponent } from '../home/obligation/obligation.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, 
    ValidErrModule,
    TranslateModule,
    MaterialModule,
    RouterModule,
    YnModule,
    MomentModule
  ],
  exports:[
    TranslateModule,
    ValidErrModule,
    PaymentComponent, 
    AddComponent, 
    DeleteComponent
  ],
  declarations: [
    PaymentComponent, 
    AddComponent, 
    DeleteComponent
  ],
  providers: [
    { provide: UsersService, useClass: UsersService },
    { provide: PaymentService, useClass: PaymentService },
    { provide:ObligationService, useClass:ObligationService},
    {
      provide:ExcelService ,
      useClass:ExcelService 
    }, AuthenticationService,
    LocalStorageService
  ],
  entryComponents: [
    AddComponent,
    DeleteComponent
  ],
})
export class PaymentModule { }
