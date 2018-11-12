import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneComponent , DeletePhoneDialog} from './phone/phone.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PhoneService } from './phone.service';
import { AddPhoneComponent } from './add-phone/add-phone.component';
import { EditPhoneComponent } from './edit-phone/edit-phone.component';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { Angular2TokenService } from 'angular2-token';
import { YnModule } from '../pipes/yn.module';
import { MobilityNumbersComponent } from './mobility-numbers/mobility-numbers.component';
import { MomentModule } from 'angular2-moment';
import { ConfirmTransComponent } from './confirm-trans/confirm-trans.component';
import { RouterModule } from '@angular/router';
import { PhoneInfoComponent } from './phone-info/phone-info.component';
import { OrderService } from '../order/order.service';
import { MemberService } from '../member/member.service';
import { SettingsService } from '../settings/settings.service';
import { AddOrderComponent } from './add-order/add-order.component';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
import { HotmobileStatusService } from '../hotmobile-status/hotmobile-status.service';
import { CellcomStatusService } from '../cellcom-status/cellcom-status.service';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    FormsModule, 
    ReactiveFormsModule,
    ValidErrModule,
    BrowserModule,
    BrowserAnimationsModule,
    YnModule,
    MomentModule,
    RouterModule
  ],
  exports:[
    PhoneComponent,
    TranslateModule,
    AddPhoneComponent, 
    EditPhoneComponent,
    ValidErrModule, 
    DeletePhoneDialog,
    MobilityNumbersComponent,
    ConfirmTransComponent
  ],
  providers:[
    {
      provide: PhoneService, 
      useClass: PhoneService
    },
    {
      provide: OrderService, 
      useClass: OrderService
    },
    {
      provide: MemberService, 
      useClass: MemberService
    },
    {
      provide: UsersService, 
      useClass: UsersService
    },
    {
      provide: ProductService, 
      useClass: ProductService
    },
    {
      provide: CompanyService, 
      useClass: CompanyService
    },
    {
      provide: CompanyService, 
      useClass: CompanyService
    },
    {
      provide:SettingsService ,
      useClass:SettingsService 
    },
    {
      provide:ExcelService ,
      useClass:ExcelService 
    },
    {provide:HotmobileStatusService,useClass:HotmobileStatusService}
    ,
    {provide:CellcomStatusService,useClass:CellcomStatusService}
    ,
    AuthenticationService
  ],
  declarations: [
    PhoneComponent, 
    EditPhoneComponent, 
    AddPhoneComponent,
    DeletePhoneDialog, 
    MobilityNumbersComponent, 
    ConfirmTransComponent, 
    PhoneInfoComponent, 
    AddOrderComponent
  ],
  entryComponents: [
    AddPhoneComponent, 
    EditPhoneComponent,
    DeletePhoneDialog,
    ConfirmTransComponent,
    AddOrderComponent,
  ]
})
export class PhoneModule { }
