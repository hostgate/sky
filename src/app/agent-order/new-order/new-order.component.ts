import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../login/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AgentOrderService } from '../agent-order.service';
import { OrderService } from '../../order/order.service';
import { BlockPackegesService } from '../../block-packages/block-packeges.service';
@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  phone_id:number=null;
  phone:any;
  lan:any;
  loading:Boolean=false;
  products:any[];
  constructor(
    private agentOrderService:AgentOrderService,
    private orderService:OrderService,
    private router:Router,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private route: ActivatedRoute,
    private blockPackegesService:BlockPackegesService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-new-order');
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.phone_id =+params['id']; 
      this.blockPackegesService.getAgentProducts(this.authService.getCurrentUserId()).subscribe(res=>{
        this.products=res;
        this.loadPhone();
      });
     
    });
  }
  loadPhone(){
    this.agentOrderService.getPhone(this.phone_id).subscribe(response=>{
      this.phone=response;
      this.phone.products=this.phone.products.filter(el=>this.products.filter(ll=>ll.id==el.id).length>0);
      if(!this.isFree(this.phone)){
        this.router.navigate(['/']);
      }
    });
  }
  view_info:Boolean=false;
  viewInfo(){
    this.view_info=!this.view_info;
  }
  note:string='';
  addOrder(){
    let order={
      agent_id:this.authService.getCurrentUserId(),
      member_id:this.phone.member.id,
      product_id:this.selectedProduct.id,
      note:this.note,
    };
    this.loading=true;
    this.orderService.add([order]).subscribe(response=>{
      this.loading=false;
      this.router.navigate(['/הזמנות']);
    });

  }
  selectedProduct:any=false;
  setProduct(p){
    this.selectedProduct=p;
    this.view_info=false;
    this.note='';
  }
  resetProduct(){
    this.selectedProduct=false;
    this.note='';
  }
  isFree(phone){
    if(phone){
      if(phone && !phone.member){
        return phone.agent_id==this.authService.getCurrentUserId();
      }
      else{
        let member=phone.member;
        return (member.agent_id==this.authService.getCurrentUserId())
              || (member.agent_id!=this.authService.getCurrentUserId() && member.free=='1');
      }
    }
    return false;
  }
  getProductCompany(company){
    let c =company.name;
    if(this.lan=='he') return c;
    if(this.lan=='en'){
      if(company.name_en!=''){
        c=company.name_en;
      }
    }
    else{
      if(company.name_ar!=''){
        c=company.name_ar;
      }
    }
    return c;
  }
  getProductName(row){
    let c =row.name;
    if(this.lan=='he') return c;
    if(this.lan=='en'){
      if(row.name_en!=''){
        c=row.name_en;
      }
    }
    else{
      if(row.name_ar!=''){
        c=row.name_ar;
      }
    }
    return c;
  }
  getProductDescription(row){
    let c =row.description;
    if(this.lan=='he') return c;
    if(this.lan=='en'){
      if(row.description_en!=''){
        c=row.description_en;
      }
    }
    else{
      if(row.description_ar!=''){
        c=row.description_ar;
      }
    }
    return c;
  }
}
