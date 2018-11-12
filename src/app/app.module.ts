import { AddCompany } from './company/company/company.component';
import { BrowserModule ,} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CompanyModule } from "./company/company.module";
import { UsersModule } from "./users/users.module";
import { ConsumerModule } from "./consumer/consumer.module";
import { LoginModule } from "./login/login.module";
import { AppComponent } from './app.component';
import { HttpModule } from "@angular/http";
import { ServerDateTime } from "./model/server_date_time";
import { ServerDateTimeService } from "./server-date-time.service";
import { LocalStorageService } from "./local-storage.service";
import { ValidationService } from "./validation.service";
import { AuthenticationService } from "./login/authentication.service"; 
import { AuthGuard } from "./login/auth.guard";
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Http } from "@angular/http";
import { AppRoutingModule } from "./app.module.routing";
import {MdNativeDateModule, MdPaginatorIntl} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import 'hammerjs';
import { ProductModule } from "./product/product.module";
import { GlobalDiscountModule } from './global-discount/global-discount.module';
import { MaterialModule } from './material.module';
import { SimModule } from './sim/sim.module';
import { PhoneModule } from './phone/phone.module';
import { JwtHelper } from 'angular2-jwt';
import { MemberModule } from './member/member.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { AgentModule } from './agent/agent.module';
import { SettingsModule } from './settings/settings.module';
import { HomeModule } from './home/home.module';
import { MyClassIntl } from './my-class-intl';
import { ComparisonsModule } from './comparisons/comparisons.module';
import { ReportModule } from './report/report.module';
import { AdminGuard } from './login/admin.guard';
import { AgentOrderModule } from './agent-order/agent-order.module';
import { NotificationService } from './notification.service';
import { MsgComponent } from './msg/msg.component';
import { SettingsService } from './settings/settings.service';
import { CanEditGuard } from './login/can-edit.guard';
import { BlockPackagesModule } from './block-packages/block-packages.module';
import { ExcelOrderModule } from './excel-order/excel-order.module';
import { HotmobileStatusModule } from './hotmobile-status/hotmobile-status.module';
import { CellcomStatusModule } from './cellcom-status/cellcom-status.module';
import { AgentsCreditsModule } from './agents-credits/agents-credits.module';
import { IpPermissionModule } from './ip-permission/ip-permission.module';
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, 'https://www.skypanel.net/api/lan', '.php');
}
@NgModule({
  declarations: [
    AppComponent,AddCompany, MsgComponent], 
  imports: [
    AgentModule,
    AgentOrderModule,
    BrowserModule,
    CompanyModule,
    MemberModule,
    SimModule,
    PhoneModule,
    PaymentModule,
    OrderModule,
    HomeModule,
    ConsumerModule,
    UsersModule,
    ProductModule,
    ComparisonsModule,
    BlockPackagesModule,
    ReportModule,
    LoginModule, 
    HttpModule,
    AppRoutingModule,
    GlobalDiscountModule,
    ExcelOrderModule,  
    FormsModule,
    ReactiveFormsModule,
    HotmobileStatusModule ,
    CellcomStatusModule,
    AgentsCreditsModule,
    IpPermissionModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http],
      
    }),
    MaterialModule,
    BrowserAnimationsModule,
    MdNativeDateModule,
    SettingsModule,
    
  ],
  exports:[MaterialModule],
  providers: [
    { provide: MdPaginatorIntl, useClass: MyClassIntl }, 
    { 
      provide: ServerDateTimeService, 
      useClass: ServerDateTimeService 
    },
    { 
      provide: ValidationService, 
      useClass: ValidationService 
    }, 
    { 
      provide: NotificationService, 
      useClass: NotificationService 
    },
    { 
      provide: SettingsService, 
      useClass: SettingsService  
    },
    AuthGuard,
    AdminGuard,
    CanEditGuard,
    AuthenticationService,
    LocalStorageService,
    JwtHelper,
    { provide: 'Window',  useValue: window }
  ], 
   
  bootstrap: [AppComponent],
  entryComponents: [AddCompany,MsgComponent],
})
export class AppModule { }
