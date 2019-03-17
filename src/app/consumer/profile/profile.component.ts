import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentService } from '../../agent/agent.service';
import { UsersService } from '../../users/users.service';
import { ConsumerService } from '../consumer.service';
import { MemberService } from '../../member/member.service';
import { OrderService } from '../../order/order.service';
import { ExcelService } from '../../excel.service';
import { LocalStorageService } from '../../local-storage.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  id:number=null;
  public customer:any;
  public agent:any;
  loading:boolean=false;
  lan:any;
  constructor(private route: ActivatedRoute,
    private router:Router,
    private agentService:AgentService,
    private userService:UsersService,
    private customerService:ConsumerService,
    private memberService:MemberService,
    private orderService:OrderService,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-profile');
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
        return el.phone+' >> '+el.moved_to_phone;
      }
      if(el.moved_to_phone!='0' && el.accepted_moved_to_phone=='0'){
        return el.phone+' >> '+el.moved_to_phone;
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
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id =+params['id'];
      this.loadCustomer();
      //console.log(this.customer);
    });
  }
  load_orders:number=null;
  loadCustomer(){
    this.loading=true;
    this.customerService.getConsumer(this.id).subscribe(res=>{
      this.loading=false;
      this.customer=res;
     this.memberService.getAgentMembers(this.customer.parent).subscribe(members=>{
      this.loading=false;
      this.customer.members=members.filter(el=>el.consumer_id==this.customer.id);
      this.load_orders=this.customer.members.length;
      this.customer.members.forEach(member => {
        this.loading=true;
        this.orderService.getMemberOrders(member.id).subscribe(orders=>{
          this.load_orders--;
          this.loading=false;
         if(orders && !orders['message'])
          member.orders=[orders.reverse()[0]];
        });
      });
    });
    });
  }
 
}
