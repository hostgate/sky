import { Component, OnInit } from '@angular/core';
import { AgentService } from '../agent.service';
import { AgentOrderService } from '../../agent-order/agent-order.service';
import { OrderService } from '../../order/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { ProductService } from '../../product/product.service';
import { CompanyService } from '../../company/company.service';
import { ObligationService } from '../../users/obligation.service';
import { SimService } from '../../sim/sim.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import { PhoneService } from '../../phone/phone.service';
import { BlockPackegesService } from '../../block-packages/block-packeges.service';
import { UsersService } from '../../users/users.service';
@Component({
  selector: 'app-new-charge',
  templateUrl: './new-charge.component.html',
  styleUrls: ['./new-charge.component.css']
})
export class NewChargeComponent implements OnInit {
  lan:any;
  loading:Boolean=false;
  products:any[]=null;
  _products:any[]=null;
  companies:any[]=null;
  selectedProduct:any=null;
  view_info:Boolean=false;
  obligation:any;
  sims:any[]=null;
  phones:any[]=null;
  choose_sim:Boolean=false;
  has_sims:Boolean=true;
  selectedSim:any=null;
  sim:FormControl = new FormControl();
  phone:FormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  filteredPhoneOptions: Observable<any[]>;
  moved_number:Boolean=false;
  moved_to_phone:string='';
  can_block_member:Boolean=false;
  block_others:Boolean=false;
  agent_id:number=null;
  agents:any[]=null;
  viewInfo(){
    this.view_info=!this.view_info;
  }
  note:string='';
  constructor(
    private agentService:AgentService,
    private usersService:UsersService,
    private agentOrderService:AgentOrderService,
    private orderService:OrderService,
    private productService:ProductService,
    private companyService:CompanyService,
    private obligationService:ObligationService,
    private simService:SimService,
    private phoneService:PhoneService,
    private router:Router,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private route: ActivatedRoute,
    private blockPackegesService:BlockPackegesService
  ) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-new-charge');
      if(this.authService.isAgent()){
        this.agent_id=this.authService.getCurrentUserId();
      }
      this.getAgentObligation();
      this.listCompanies();
     
    }
  init(){
    //console.log('this.agent_id',this.agent_id);
    this.filteredOptions = this.sim.valueChanges.startWith('').map(val => this.filter(val));
    this.filteredPhoneOptions = this.phone.valueChanges.startWith('').map(val => this.filterPhones(val));
    this.blockPackegesService.getAgentProducts(this.agent_id).subscribe(res=>{
      this._products=res;
      this.listProduct(this.agent_id);
    });
  }
  getAgentName(agent_id){
    let agent:any=this.agents.filter(el=>el.id==agent_id)[0];
    return agent.firstname+' '+agent.lastname;
  }
  resetAgent(){
    this.resetProduct(); 
    this.agent_id=null;
  }
  ngOnInit() {
   if(this.agent_id) {
    this.init();
   }
   else{
    this.loading=true;
     this.usersService.getAgents().subscribe(res=>{
       this.loading=false;
       this.agents=res;
     })
   }
   
    
  }
  filter(val: string): string[] {
    if(!this.sims)return [];
    return this.sims.filter(option =>
      option.sim.toLowerCase().indexOf(val.toLowerCase()) >= 0);
  }
  filterPhones(val: string): string[] {
    if(!this.phones)return [];
    return this.phones.filter(option =>
      option.phone.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  listProduct(agent_id){
    this.productService.getPriceList(agent_id).subscribe(res=>{
      this.products=res;
        this.can_block_member=this.products && this.products.length>0 && this.products[0].agent_block_my_members=='1';
    })
  }
  inProducts(p){
    return this._products.filter(el=>el.id==p.product_id).length>0;
  }
  listCompanies(){
    this.loading=true;
    this.companyService.getCompanys().subscribe(res=>{
      this.loading=false;
      this.companies=res;
    })
  }
  getProductCompany(product){
    if(!this.companies)return [];
    let company=this.companies.filter(el=>product.product_company_id==el.id)[0];
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
    let c =row.product_name;
    if(this.lan=='he') return c;
    if(this.lan=='en'){
      if(row.product_name_en!=''){
        c=row.product_name_en;
      }
    }
    else{
      if(row.product_name_ar!=''){
        c=row.product_name_ar;
      }
    }
    return c;
  }
  getProductDescription(row){
    let c =row.product_description;
    if(this.lan=='he') return c;
    if(this.lan=='en'){
      if(row.product_description_en!=''){
        c=row.product_description_en;
      }
    }
    else{
      if(row.product_description_ar!=''){
        c=row.product_description_ar;
      }
    }
    return c;
  }
  setProduct(p){
    this.selectedProduct=p;
    this.getNotUsedAgentCompanySims();
    this.getNotUsedAgentProductPhones();
    this.view_info=false;
    this.note='';

  }
  resetProduct(){

    //test
    this.selectedProduct=null;   
    this.note='';
    this.sims=null;
    this.has_sims=false;
    this.choose_sim=false;
    this.selectedSim=null;
    this.sim.setValue('');
    this.phones=null;
    this.choose_phone=false;
    this.selectedPhone=null;
    this.phone.setValue('');
    this.moved_number=false;
    this.moved_to_phone='';
  }
  getAgentObligation(){
    let agent_id:number=this.agent_id;
    this.loading=true;
    this.obligationService.getObligation(this.agent_id).subscribe(res=>{
      this.loading=false;
      this.obligation=res;
    })
  }
  getNotUsedAgentCompanySims(){
    let agent_id:number=this.agent_id;
    let company_id:number=this.selectedProduct.product_company_id;
    this.loading=true;
    this.simService.getNotUsedAgentCompanySims(agent_id,company_id).subscribe(res=>{
      this.loading=false;
      this.sims=res;
      if(this.sims.length==0){
        this.has_sims=false;
      }
      else{
        this.choose_sim=true;
      }
    });
  }
  choose_phone:Boolean=false;
  selectedPhone:any=null;
  resetPhone(){
    this.choose_phone=true;
    this.selectedPhone=null;
    this.phone.setValue('');
    this.moved_number=false;
    this.moved_to_phone='';
  }
  setSim(e){
    this.selectedSim=this.sims.filter(el=>el.sim==e.option.value)[0];
    this.choose_sim=false;
    this.choose_phone=true;
  }
  setPhone(e){
    this.selectedPhone=this.phones.filter(el=>el.phone==e.option.value)[0];
    this.choose_phone=false;
  }
  resetSim(){
    this.selectedSim=null;
    this.choose_sim=true;
    this.sim.setValue('');
    this.choose_phone=false;
    this.selectedPhone=null;
    this.phone.setValue('');
    this.moved_number=false;
    this.moved_to_phone='';
  }
  getNotUsedAgentProductPhones(){
    let agent_id:number=this.agent_id;
    let company_id:number=this.selectedProduct.product_company_id;
    let product_id=this.selectedProduct.product_id;
    this.loading=true;
    this.phoneService.getNotUsedAgentCompanyPhones(agent_id,company_id,product_id).subscribe(res=>{
      this.loading=false;
      this.phones=res;
    })
  }
  resetMovedNumber(){
    this.moved_number=false;
    this.moved_to_phone='';
  }
 in_use=false;
  isPhone(phone) {
    let flag=true;
    let numbers: Array<string>=['0','1','2','3','4','5','6','7','8','9'];
    let preps: Array<string>=['050','052','053','054','055','057','058'];
    let p:string='';
    let prep:string='';
    for (let i = 0, len = phone.length; i < len; i++) {
      if(numbers.includes(phone[i])){
        p+=phone[i];
      }
    }
    if(p.length<9 || p.length>10){
      flag=false;
    }
    else{
      prep=p[0]+p[1];
    }
    if(p.length==10){
      prep+=p[2];
    }
    if(!preps.includes(prep)){
      flag=false;
    }
    
    return flag;
  }
  used_moved:any[]=[];
  inUse(phone){
    if(this.isPhone(phone)){
      let arr=this.used_moved.filter(el=>el.phone==this.moved_to_phone);
      if(arr.length==0){
        this.phoneService.in_use(phone).subscribe(res=>{
          this.used_moved.push({phone:this.moved_to_phone,in_use:res=='1'?true:false});
          this.in_use=res=='1'?true:false;
         // console.log(res);
        })
      }
      else{
        this.in_use=arr[0].in_use;
      }
    }
  }
  showSubmit(){
    return this.selectedProduct && this.selectedSim && this.selectedPhone && (!this.moved_number || 
      (this.moved_number && (this.isPhone(this.moved_to_phone))));
  }
  loading2:Boolean=false;
  addOrder(){
    this.phoneService.in_use(this.moved_to_phone).subscribe(res=>{
      if(res=='1'){
        alert('מספר הניוד שבחרת ('+this.moved_to_phone+') קיים אצלנו במערכת!!. ביצוע הפעולה יצטרך אישור המנהל. תודה..');
      }
      else{
        let order={
          product_id:this.selectedProduct.product_id,
          agent_id:this.selectedProduct.agent_id,
          company_id:this.selectedProduct.product_company_id,
          discount:this.selectedProduct.discount,
          profit:this.selectedProduct.profit,
          price:this.selectedProduct.product_price,
          sim_id:this.selectedSim.id,
          sim:this.selectedSim.sim,
          phone_id:this.selectedPhone.id,
          phone:this.selectedPhone.phone,
          moved_to_phone:this.moved_number?this.moved_to_phone:"0",
          free:this.block_others?'0':'1',
          note:this.note
        }
        this.loading2=true;
        this.loading=true;
       // console.log(order);
        this.agentService.addMemberAndOrder(order).subscribe(res=>{
          this.loading2=false;
          this.loading=false;
          this.router.navigate(['/מספר/'+order.phone_id ]);
        });
    }
        
      });
    
  }  
  isExceeded(){
    let obligation=-1*(this.obligation.obligation);
    let credit=this.obligation.credit;
    let price=(this.selectedProduct.product_price-(0.01*this.selectedProduct.discount*this.selectedProduct.product_price));
    return credit-price<=obligation;
  }
}
