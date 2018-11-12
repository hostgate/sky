import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcelOrderComponent } from './excel-order/excel-order.component';
import { AgentService } from '../agent/agent.service';
import { AgentOrderService } from '../agent-order/agent-order.service';
import { UsersService } from '../users/users.service';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { ObligationService } from '../users/obligation.service';
import { SimService } from '../sim/sim.service';
import { PhoneService } from '../phone/phone.service';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
import { LocalStorageService } from '../local-storage.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { YnModule } from '../pipes/yn.module';
import { MaterialModule } from '../material.module';
import { MomentModule } from 'angular2-moment';
import { ExcelChargeComponent } from './excel-charge/excel-charge.component';

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
  declarations: [ExcelOrderComponent, ExcelChargeComponent],
  entryComponents: [ExcelOrderComponent, ExcelChargeComponent],
  providers: [
    { provide: AgentService, useClass: AgentService },
    { provide: AgentOrderService, useClass: AgentOrderService},
    { provide: UsersService, useClass: UsersService },
    { provide: ProductService, useClass: ProductService},
    { provide: CompanyService, useClass: CompanyService},
    { provide: ObligationService, useClass: ObligationService },
    { provide: SimService, useClass: SimService},
    { provide: PhoneService, useClass: PhoneService},
    { provide: ExcelService, useClass: ExcelService },
     AuthenticationService,
     LocalStorageService
  ]
})
export class ExcelOrderModule { }
