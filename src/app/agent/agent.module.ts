import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentComponent } from './agent/agent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from 'ng2-translate';
import { YnModule } from '../pipes/yn.module';
import { MaterialModule } from '../material.module';
import { MomentModule } from 'angular2-moment';
import { AgentService } from './agent.service';
import { UsersService } from '../users/users.service';
import { ConsumerService } from '../consumer/consumer.service';
import { ObligationService } from '../users/obligation.service';
import { MemberService } from '../member/member.service';
import { OrderService } from '../order/order.service';
import { PaymentService } from '../payment/payment.service';
import { NewPasswordComponent } from './new-password/new-password.component';
import { EditComponent } from './edit/edit.component';
import { ObligationUpdateComponent } from './obligation-update/obligation-update.component';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AgentInfoComponent } from './agent-info/agent-info.component';
import { AgentObligationComponent } from './agent-obligation/agent-obligation.component';
import { AgentPaymentsComponent } from './agent-payments/agent-payments.component';
import { AgentMembersComponent } from './agent-members/agent-members.component';
import { PriceChangeComponent } from './price-change/price-change.component';
import { ExcelService } from '../excel.service';
import { ReportComponent, KeysPipe } from './report/report.component';
import { AuthenticationService } from '../login/authentication.service';
import { NewChargeComponent } from './new-charge/new-charge.component';
import { AgentOrderService } from '../agent-order/agent-order.service';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { SimService } from '../sim/sim.service';
import { PhoneService } from '../phone/phone.service';
import { LocalStorageService } from '../local-storage.service';
import { BlockPackegesService } from '../block-packages/block-packeges.service';
import { AgentAgreementComponent } from './agent-agreement/agent-agreement.component';
import { AddAgreementComponent } from './add-agreement/add-agreement.component';
import { DeleteAgreementComponent } from './delete-agreement/delete-agreement.component';
import { AgentNotesComponent } from './agent-notes/agent-notes.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { DeleteNoteComponent } from './delete-note/delete-note.component';

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
  exports : [
    AgentComponent,
    NewPasswordComponent,
    EditComponent,
    ObligationUpdateComponent,
    AddPaymentComponent,
    ReportComponent,
    KeysPipe
  ],
  declarations: [
    AgentComponent,
    NewPasswordComponent,
    EditComponent,
    ObligationUpdateComponent,
    AddPaymentComponent,
    AgentInfoComponent,
    AgentObligationComponent,
    AgentPaymentsComponent,
    AgentMembersComponent,
    PriceChangeComponent,
    ReportComponent,KeysPipe, 
    NewChargeComponent, 
    AgentAgreementComponent, 
    AddAgreementComponent, 
    DeleteAgreementComponent, 
    AgentNotesComponent, 
    AddNoteComponent, 
    DeleteNoteComponent
  ],
  entryComponents: [
    NewPasswordComponent,
    EditComponent,
    ObligationUpdateComponent,
    AddPaymentComponent,
    ReportComponent, 
    NewChargeComponent, 
    AgentAgreementComponent, 
    AddAgreementComponent, 
    DeleteAgreementComponent, 
    AgentNotesComponent, 
    AddNoteComponent, 
    DeleteNoteComponent
  ],
  providers: [
    { provide: AgentService, useClass: AgentService },
    { provide: AgentOrderService, useClass: AgentOrderService},
    { provide: UsersService, useClass: UsersService },
    { provide: ProductService, useClass: ProductService},
    { provide: CompanyService, useClass: CompanyService},
    { provide: ConsumerService, useClass: ConsumerService },
    { provide: ObligationService, useClass: ObligationService },
    { provide: MemberService, useClass: MemberService },
    { provide: OrderService, useClass: OrderService },
    { provide: PaymentService, useClass: PaymentService },
    { provide: SimService, useClass: SimService},
    { provide: PhoneService, useClass: PhoneService},
    { provide: ExcelService, useClass: ExcelService },
    { provide :BlockPackegesService,useClass:BlockPackegesService},
     AuthenticationService,
     LocalStorageService
  ],
})
export class AgentModule { }
