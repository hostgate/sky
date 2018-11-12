import { Component, OnInit } from '@angular/core';
import { AgentService } from '../agent.service';
import { UsersService } from '../../users/users.service';
import { ConsumerService } from '../../consumer/consumer.service';
import { ObligationService } from '../../users/obligation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/user';
import { Obligation } from '../../model/obligation';
import { MemberService } from '../../member/member.service';
import { Member } from '../../model/member';
import { OrderService } from '../../order/order.service';
import { PaymentService } from '../../payment/payment.service';
import { MdDialog, MdPaginatorIntl } from '@angular/material';
import { EditComponent } from '../edit/edit.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { ObligationUpdateComponent } from '../obligation-update/obligation-update.component';
import { AddPaymentComponent } from '../add-payment/add-payment.component';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  id:number=null;
  public agent:any;
  loading:boolean=false;
  lan:any;
  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private agentService:AgentService,
    private userService:UsersService,
    private cansomerService:ConsumerService,
    private obligationService:ObligationService,
    private memberService:MemberService,
    private orderService:OrderService,
    private paymentService:PaymentService,
    public  dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public  authService:AuthenticationService){
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent)=>{this.lan=event.lang;});
      localStorage.setItem('currentComponent','app-agent');
   }
  openObligationUpdate(){
    let dialogRef=this.dialog.open(ObligationUpdateComponent,{
      width:'310px',
      data:{agent:this}
    });
    dialogRef.afterClosed().subscribe(result=>{});
  }
  openPaymentAdd(id){
    let dialogRef=this.dialog.open(AddPaymentComponent,{
      width:'310px',
      data:{agent:this,id:id}
    });
    dialogRef.afterClosed().subscribe(result=>{});
  }
  searchMembers(members,val){
    if(val==''){
      return members;
    }else{
      return members.filter(
        member => member.phone.indexOf(val)>=0);
    }
  }
  transStatus(status){
    switch(status){
      case 'new':
       return 'חדש';
       case 'declined':
       return 'נדחה';
       case 'cancel':
       return 'מובטל';
       case 'completed':
       return 'פעיל';
       case 'disconnected':
       return 'מנותק';
       case 'finished':
       return 'פג תוקף';
    }
  }
  getPhone(el){
    if(el.moved_to_phone=='0' && el.accepted_moved_to_phone=='0'){
      return el.phone;
    }
    if(el.moved_to_phone!='0' && el.accepted_moved_to_phone=='1'){
     return el.moved_to_phone;
    }
    if(el.moved_to_phone!='0' && el.accepted_moved_to_phone=='0'){
      return el.moved_to_phone;
    }
  }
  loadExcelMembers(members,val){ 
    let excel:any=[];
    this.searchMembers(members,val).forEach(el=>{
      let a:any={
        'id':el.id,
        'לקוח':el.consumer_name,
        'טלפון':this.getPhone(el),
        'חבילה':el.orders?el.orders[0].company_name+'/'+el.orders[0].product_name:'אין הזמנות',
        'סטטוס':el.orders?this.transStatus(el.orders[0].status):'אין הזמנות',
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים');
  }
  ngOnInit(){
    this.route.params.subscribe(params =>{
      this.id =+params['id'];
      this.loadAgentData();
      setTimeout(()=>this.agent.load=function(){this.loadAgentData();},1000);
    });
  }
  check_member_orders:number=null;
  loadAgentData(){
    this.loading=true;
    this.userService.getUser(this.id).subscribe(agent=>{
      this.agent=agent;
      // this.memberService.getAgentMembers(this.id).subscribe(members=>{
      //   this.loading=true;
      //   this.agent.members=members;
      //   if(this.authService.isAgent()){
      //     this.agent.members=this.agent.members.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
      //   }
      //   else{
      //     this.agent.members=this.agent.members.filter(el=>(el.agent_id==this.id));
      //   }
      //   if(this.agent.members.length==0){
      //     this.loading=false;
      //   }
      //   this.agent.members.forEach(member=>{
      //     this.loading=true;
      //     this.check_member_orders=this.agent.members.length;
      //     this.orderService.getMemberOrders(member.id).subscribe(orders=>{
      //       this.check_member_orders--;
      //       this.loading=false;
      //      if(orders && !orders['message'])
      //       member.orders=[orders.reverse()[0]];
      //     });
      //   });
      // });
      this.obligationService.getObligation(this.id).subscribe(obligation=>{
        this.loading=false;
        this.agent.obligation=obligation;
        this.agent.obligation.can_use=parseFloat(this.agent.obligation.credit)+parseFloat(this.agent.obligation.obligation);
        if(this.agent.obligation.can_use<0){
          this.agent.obligation.can_use=0;
        }
      });
      this.paymentService.getAgentPayments(this.id).subscribe(payments=>{
        this.loading=false;
        this.agent.payments=payments;
      });
    });
  }
  openMore(){}
  loadMembers(){
    this.loading=true;
    this.memberService.getAgentMembers(this.id).subscribe(members=>{
     // this.loading=false;
      this.agent.members=members;
      if(this.authService.isAgent()){
        this.agent.members=this.agent.members.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
      }
      else{
        this.agent.members=this.agent.members.filter(el=>(el.agent_id==this.id));
      }
      if(this.agent.members.length==0){
       // this.loading=false;
      }
      this.check_member_orders=this.agent.members.length;
      if(this.agent.members.length==0)
          this.loading=false;
      this.agent.members.forEach(member=>{
        //this.loading=true;
        
        this.orderService.getMemberOrders(member.id).subscribe(orders=>{
          this.check_member_orders--;
          if(this.check_member_orders==0 || this.agent.members.length==0)
          this.loading=false;
         if(orders && !orders['message'])
          member.orders=[orders.reverse()[0]];
        });
      });
      //if(this.check_member_orders==0)
          //this.loading=false;
    });
  }
}
