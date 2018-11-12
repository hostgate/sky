import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from '../order.service';
import { Order } from '../../model/order';
import { MemberService } from '../../member/member.service';
import { SimService } from '../../sim/sim.service';
import { PhoneService } from '../../phone/phone.service';
import { CompanyService } from '../../company/company.service';
import { ProductService } from '../../product/product.service';
import { UsersService } from '../../users/users.service';
import { Member } from '../../model/member';
import { Product } from '../../model/product';
import { User } from '../../model/user';
import { Phone } from '../../model/phone';
import { Sim } from '../../model/sim';
import { Company } from '../../model/company';
import { ObligationService } from '../../users/obligation.service';
import { Obligation } from '../../model/obligation';
import { Consumer } from '../../model/consumer';
import { ConsumerService } from '../../consumer/consumer.service';
import { CompleteComponent } from '../complete/complete.component';
import { MdPaginatorIntl, MdDialog } from '@angular/material';
import { DeleteComponent } from '../delete/delete.component';
import { DeclineComponent } from '../decline/decline.component';
import { CancelComponent } from '../cancel/cancel.component';
import { SettingsService } from '../../settings/settings.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css']
})
export class OrderInfoComponent implements OnInit {
  position = 'above';
  loading:Boolean=true;
  id:number;
  order:any=null;
  agent:User;
  member:Member=null;
  consumer:Consumer=null;
  product:Product=null;
  add_by:User=null;
  declined_by:any=null;
  canceled_by:any=null;
  completed_by:any=null;
  phone:Phone=null;
  sim:Sim=null;
  obligation:Obligation=null;
  lan:any;
  constructor(
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private route: ActivatedRoute,
    private router:Router,
    private orderService:OrderService,
    private userService:UsersService,
    private productService:ProductService,
    private phoneService:PhoneService,
    private simService:SimService,
    private memberService:MemberService,
    private consumerService:ConsumerService,
    private obligationService:ObligationService,
    private settingsService:SettingsService,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      //private trans:TranslateService
      // private lsService:LocalStorageService
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-order-info');
}
getCurrentTime(){
  let t=new Date();
  return t.getTime()/1000;
}
myUrl;
timeToActiveCancel:any=null;
restTimeToCancel:any;
restTimeToCancelH:any;
restTimeToCancelM:any;
restTimeToCancelS:any;
currentTime:any;
timeout() {
  setTimeout( ()=> {
   
    //if(this.order!=null){
      this.settingsService.getTime().subscribe(t=>{
        let tt:any=t; 
        this.currentTime=tt._body;
        this.restTimeToCancel=(this.timeToActiveCancel-tt._body).toFixed(0);
        this.restTimeToCancelM = Math.floor(this.restTimeToCancel / 60);
        this.restTimeToCancelS = this.restTimeToCancel - this.restTimeToCancelM  * 60;
        this.restTimeToCancelH = Math.floor(this.restTimeToCancel / 3600);
        this.restTimeToCancelM= this.restTimeToCancelM%60;
        if(localStorage.getItem('currentComponent')&&localStorage.getItem('currentComponent')=='app-order-info'){
          if(this.timeToActiveCancel==null||(this.timeToActiveCancel!=null && (this.timeToActiveCancel-tt._body)>=0)){
            if((this.order!=null && this.order.status=='completed')){
               this.timeout();
            }
          }
        }
      });
  }, 1000);
}
  loadData(){
    this.orderService.getOrder(this.id).subscribe(orderRes=>{
      if(orderRes && !orderRes['message']){
        this.order=orderRes;
       // if(this.order.status=='completed'){
        this.getTimeToCancel();
          this.timeout();
       // }
       // }
        this.memberService.getMember(this.order.member_id).subscribe(
          memberRes=>{
            if(memberRes && !memberRes['message']){
              this.member=memberRes;
              this.doLoading();
              this.consumerService.getConsumerOther(this.member.consumer_id).subscribe(
                consumerRes=>{
                  if(consumerRes && !consumerRes['message']){
                    this.consumer=consumerRes;
                    this.doLoading();
                  }
                }
              );
            }
          }
        );
        this.userService.getAdminUser(this.order.add_by).subscribe(
          add_byRes=>{
            if(add_byRes && !add_byRes['message']){
              this.add_by=add_byRes;
              this.doLoading();
            }
          }
        );
        if(this.order.completed_by!=0){
          this.userService.getAdminUser(this.order.completed_by).subscribe(
            completed_byRes=>{
              if(completed_byRes && !completed_byRes['message']){
                this.completed_by=completed_byRes;
                this.doLoading();
              }
            }
          );
        }
        else{
          this.completed_by=0;
        }
        if(this.order.declined_by!=0){
          this.userService.getAdminUser(this.order.declined_by).subscribe(
            declined_byRes=>{
              if(declined_byRes && !declined_byRes['message']){
                this.declined_by=declined_byRes;
                this.doLoading();
              }
            }
          );
        }
        else{
          this.declined_by=0;
        }
        if(this.order.canceled_by!=0){
          this.userService.getAdminUser(this.order.canceled_by).subscribe(
            canceled_byRes=>{
              if(canceled_byRes && !canceled_byRes['message']){
                this.canceled_by=canceled_byRes;
                this.doLoading();
              }
            }
          );
        }
        else{
          this.canceled_by=0;
        }
        this.productService.getProduct(this.order.product_id).subscribe(
          productRes=>{
            if(productRes && !productRes['message']){
              this.product=productRes;
              this.doLoading();
            }
          }
        );
        this.phoneService.getPhone(this.order.phone_id).subscribe(
          phoneRes=>{
            if(phoneRes && !phoneRes['message']){
              
              this.phone=phoneRes;
              this.doLoading();
            }
          }
        );
        this.simService.getSimOther(this.order.sim_id).subscribe( 
          simRes=>{
            if(simRes && !simRes['message']){
              this.sim=simRes;
              this.doLoading();
            }
          }
        );
        this.obligationService.getObligation(this.order.agent_id).subscribe(
          obligationRes=>{
            if(obligationRes && !obligationRes['message']){
              this.obligation=obligationRes;
              this.doLoading();
            }
          }
        );
        this.userService.getAdminUser(this.order.agent_id).subscribe(
          userRes=>{
            if(userRes && !userRes['message']){
              this.agent=userRes;
              this.doLoading();
            }
          }
        );
      }
    });
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id =+params['id'];
      this.loadData();
   });
   
  }
  getProductName(product){
    let c=product.product_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
     if(product.product_name_ar!=''){
       c=product.product_name_ar;
     }
    }
    else{
     if(product.product_name_en!=''){
       c=product.product_name_en;
     }
    }
    return c;
  }
  getCompanyName(company){
    let c=company.company_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
     if(company.company_name_ar!=''){
       c=company.company_name_ar;
     }
    }
    else{
     if(company.company_name_en!=''){
       c=company.company_name_en;
     }
    }
    return c;
  }
  doLoading(){
    this.loading=false;
    if(this.order==null||
      this.agent==null||
       this.member==null||
       this.product==null||
       this.add_by==null||
       this.declined_by==null||
       this.canceled_by==null||
       this.completed_by==null||
       this.phone==null||
       this.obligation==null||
       this.sim==null||
       this.consumer==null
      ){
        this.loading=true;
       }
  }
  complete(){
    let dialogRef=this.dialog.open(CompleteComponent,{
      width:'310px',
      data:{id:this.id,order:this.order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  delete(){
    let dialogRef=this.dialog.open(DeleteComponent,{
      width:'310px',
      data:{id:this.id,order:this.order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
      
    });
    
  }
  decline(){
    let dialogRef=this.dialog.open(DeclineComponent,{
      width:'310px',
      data:{id:this.order.id,order:this.order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
      
    });
  }
  cancel(){
    let dialogRef=this.dialog.open(CancelComponent,{
      width:'310px',
      data:{id:this.order.id,order:this.order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
      
    });
  }
  
  getTimeToCancel(){
    this.settingsService.getSettings(1).subscribe(res=>{
      if(res && !res['message'] && res[0]){
        this.timeToActiveCancel=parseFloat(res[0]._value)*60*60+parseFloat(this.order.valid_from_sec );
      }
      else{
        this.timeToActiveCancel=-100;
      }
    });
  }
  change_seen(order){
    this.orderService.changeSeen(order).subscribe(res=>{
      this.orderService.getCountCancelOrders().subscribe(response=>{
        this.lsService.setStorage('count_cancel_orders',response,99999999999);
        this.ngOnInit();
      });
    });

  }
}
