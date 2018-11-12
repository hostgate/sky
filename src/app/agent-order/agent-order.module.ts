import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewOrderComponent } from './new-order/new-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { YnModule } from '../pipes/yn.module';
import { MaterialModule } from '../material.module';
import { MomentModule } from 'angular2-moment';
import { AuthenticationService } from '../login/authentication.service';
import { AgentOrderService } from './agent-order.service';
import { OrderService } from '../order/order.service';
import { BlockPackegesService } from '../block-packages/block-packeges.service';

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
  declarations: [NewOrderComponent],
  exports: [NewOrderComponent],
  providers: [
    { provide: AgentOrderService, useClass: AgentOrderService },
    { provide: OrderService, useClass: OrderService },
    { provide :BlockPackegesService,useClass:BlockPackegesService},
     AuthenticationService
  ]
})
export class AgentOrderModule { }
