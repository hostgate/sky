import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./login/auth.guard";
import { EditUserComponent } from "./users/edit-user/edit-user.component";
import { LoginComponent } from "./login/login/login.component";
import { UsersComponent } from "./users/users/users.component";
import { EditConsumerComponent } from "./consumer/edit-consumer/edit-consumer.component";
import { AddConsumerComponent } from "./consumer/add-consumer/add-consumer.component";
import { ConsumerComponent } from "./consumer/consumer/consumer.component";
import { CompanyComponent } from "./company/company/company.component";
import { AddUserComponent } from "./users/add-user/add-user.component";
import { ProductComponent } from "./product/product/product.component";
import { GlobalDiscountComponent } from "./global-discount/global-discount/global-discount.component";
import { SimComponent } from "./sim/sim/sim.component";
import { PhoneComponent } from "./phone/phone/phone.component";
import { MemberComponent } from "./member/member/member.component";
import { PaymentComponent } from "./payment/payment/payment.component";
import { OrderComponent } from "./order/order/order.component";
import { OrderInfoComponent } from "./order/order-info/order-info.component";
import { AgentComponent } from "./agent/agent/agent.component";
import { SettingsComponent } from "./settings/settings/settings.component";
import { HomeComponent } from "./home/home/home.component";
import { MobilityNumbersComponent } from "./phone/mobility-numbers/mobility-numbers.component";
import { PhoneInfoComponent } from "./phone/phone-info/phone-info.component";
import { ProfileComponent } from "./consumer/profile/profile.component";
import { ReportComponent } from "./agent/report/report.component";
import { ComparisonsComponent } from "./comparisons/comparisons/comparisons.component";
import { GeneralReportComponent } from "./report/general-report/general-report.component";
import { AdminGuard } from "./login/admin.guard";
import { PriceListComponent } from "./product/price-list/price-list.component";
import { NewOrderComponent } from "./agent-order/new-order/new-order.component";
import { CanEditGuard } from "./login/can-edit.guard";
import { NewChargeComponent } from "./agent/new-charge/new-charge.component";
import { BlockPackagesComponent } from "./block-packages/block-packages/block-packages.component";
import { ExcelOrderComponent } from "./excel-order/excel-order/excel-order.component";
import { HotmobileStatusComponent } from "./hotmobile-status/hotmobile-status/hotmobile-status.component";
import { ExcelChargeComponent } from "./excel-order/excel-charge/excel-charge.component";
import { AgentsCreditsComponent } from "./agents-credits/agents-credits/agents-credits.component";
import { IpPermissonComponent } from "./ip-permission/ip-permisson/ip-permisson.component";
import { CellcomStatusComponent } from "./cellcom-status/cellcom-status/cellcom-status.component";
import { AutoUpdateComponent } from "./order/auto-update/auto-update.component";
import { NewGeneralReportComponent } from "./report/new-general-report/new-general-report.component";
const appRoutes: Routes = [ 
    { path: '',      component: HomeComponent , canActivate: [AuthGuard]},
    { path: 'חברות',      component: CompanyComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'סטאטוס-הוט-מובייל',      component: HotmobileStatusComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'סטאטוס-סלקום',      component: CellcomStatusComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'מינויים',      component: MemberComponent , canActivate: [AuthGuard]},
    { path: 'חבילות',      component: ProductComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'מספרי-סים',      component: SimComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'מספרי-טלפון',      component: PhoneComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'מספר/:id',      component: PhoneInfoComponent , canActivate: [AuthGuard]},
    { path: 'מספר-טלפון/:id',      component: PhoneInfoComponent , canActivate: [AuthGuard]},
    { path: 'הנחות',      component: GlobalDiscountComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'חסימת-חבילות',      component: BlockPackagesComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'מחירון',      component: PriceListComponent , canActivate: [AuthGuard]},
    { path: 'לקוחות',      component: ConsumerComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'דוח-סוכנים',      component: ReportComponent , canActivate: [AuthGuard]},
    { path: 'לקוח-חדש',      component: AddConsumerComponent , canActivate: [AuthGuard]},
    { path: 'לקוח/:id',      component: ProfileComponent , canActivate: [AuthGuard]},
    { path: 'עריכת-לקוח/:id',      component: EditConsumerComponent , canActivate: [AuthGuard]},
    { path: 'משתמשים',      component: UsersComponent, canActivate: [AuthGuard,CanEditGuard]},
    { path: 'הוספת-משתמש', component: AddUserComponent, canActivate: [AuthGuard,CanEditGuard] },
    { path: 'ניוד-מספרים', component: MobilityNumbersComponent, canActivate: [AuthGuard,CanEditGuard] },
    { path: 'עריכת-משתמש/:id', component: EditUserComponent, canActivate: [AuthGuard,CanEditGuard]},
    { path: 'סוכן/:id', component: AgentComponent, canActivate: [AuthGuard]},
    { path: 'התחברות', component: LoginComponent },
    { path: 'תשלומים',      component: PaymentComponent , canActivate: [AuthGuard]},
    { path: 'הזמנות',      component: OrderComponent , canActivate: [AuthGuard]},
    { path: 'הזמנת-אקסל',      component: ExcelOrderComponent , canActivate: [AuthGuard]},
    { path: 'טעינות-אקסל',      component: ExcelChargeComponent , canActivate: [AuthGuard]},
    { path: 'הזמנה-חדשה/:id',      component: NewOrderComponent , canActivate: [AuthGuard]},
    { path: 'טעינה-חדשה',      component: NewChargeComponent , canActivate: [AuthGuard]},
    { path: 'הגדרות',      component: SettingsComponent , canActivate: [AuthGuard,AdminGuard]},
    { path: 'הרשאות',      component: IpPermissonComponent , canActivate: [AuthGuard,AdminGuard]},
    { path: 'השוואות',      component: ComparisonsComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'חידוש-אוטומאטי',      component: AutoUpdateComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'חשבונות-סוכנים',      component: AgentsCreditsComponent , canActivate: [AuthGuard,CanEditGuard]},
    { path: 'דוח-כללי',      component: GeneralReportComponent , canActivate: [AuthGuard]},
    { path: 'דוח-כללי-חדש',      component: NewGeneralReportComponent , canActivate: [AuthGuard]},
    { path: 'הזמנה/:id',      component: OrderInfoComponent , canActivate: [AuthGuard]},
    { path: '**', redirectTo: '', canActivate: [AuthGuard] },
  ];
@NgModule({
    imports: [
      RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule { 
    
  }