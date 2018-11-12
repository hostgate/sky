import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { TranslateService, TranslateModule } from "ng2-translate";
import { MaterialModule } from '../material.module';
import { RouterModule, Routes } from '@angular/router';
import { YnModule } from '../pipes/yn.module';
import { MemberSearchComponent } from './member-search/member-search.component';
import { FormsModule } from '@angular/forms';
import { PhoneService } from '../phone/phone.service';
import { MemberService } from '../member/member.service';
import { OrderService } from '../order/order.service';
import { ConsumerService } from '../consumer/consumer.service';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from '../../../29_09_2017/src/app/login/authentication.service';
import { ObligationComponent } from './obligation/obligation.component';
import { ObligationService } from '../users/obligation.service';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MaterialModule,
    RouterModule,
    YnModule,FormsModule
  ],
  declarations: [HomeComponent, MemberSearchComponent, ObligationComponent],
  providers:[
    {provide: PhoneService, useClass: PhoneService},
    {provide: MemberService, useClass: MemberService},
    {provide: ConsumerService, useClass: ConsumerService},
    {provide: UsersService, useClass: UsersService},
    {provide: ObligationService, useClass: ObligationService},
    AuthenticationService,
    {provide: OrderService, useClass: OrderService}
  ],
  entryComponents: [
    HomeComponent,
    MemberSearchComponent,
    ObligationComponent
  ]
})
export class HomeModule { } 
