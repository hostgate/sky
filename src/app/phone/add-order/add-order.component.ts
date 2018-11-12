import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, ENTER } from '@angular/material';
import { User } from '../../model/user';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Product } from '../../model/product';
import { ProductAgent } from '../../model/product_agent';
import { Obligation } from '../../model/obligation';
import { OrderService } from '../../order/order.service';
import { UsersService } from '../../users/users.service';
import { ObligationService } from '../../users/obligation.service';
import { ProductAgentService } from '../../product/product-agent.service';
import { ProductService } from '../../product/product.service';
import { AddComponent } from '../../payment/add/add.component';
import { ValidationService } from '../../validation.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { Order } from '../../model/order';
import { AuthenticationService } from '../../login/authentication.service';
const COMMA = 188;
@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})

export class AddOrderComponent implements OnInit {

  loading:Boolean;
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  filteredAgentOptions:  Observable<any[]>=null;
  agentSearch:Boolean=false;
  orderForm:FormGroup;
  products:Product[]=[];
  member:any;
  product:Product=null;
  product_agent:ProductAgent=null;
  agents:User[];
  agent:User=null;
  agentObligo:Obligation=null;
  price:any=0;
  agent_price:any=0;
  lan:any;
  canChangePrice:Boolean=false;
  constructor(
      private orderService:OrderService,
      private usersService:UsersService,
      private obligationService:ObligationService,
      private productService:ProductService,
      private productAgentService:ProductAgentService,
      public dialogRef: MdDialogRef<AddComponent>,
      @Inject(MD_DIALOG_DATA) public data: any,
      private validationService:ValidationService,
      private formBuilder:FormBuilder,
      private trans:TranslateService,
      private lsService:LocalStorageService,
      public authService:AuthenticationService
    ) {
      
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }

  ngOnInit() {
    this.member=this.data.data.member;
    this.loadAgent();
    this.loadProducts();
    this.formOnInit();
  }
  loadAgent(){
    
    this.usersService.getUser(this.member.agent_id).subscribe(res=>{
      if(res && !res['message']){
        this.agent=res;
        this.setObligo(this.member.agent_id);
      }
    });
  }
  loadProducts(){
    this.productService.getCompanyProducts(this.member.company_id).subscribe(res=>{
      if(res && !res['message']){
        this.products=res;
      }
    });
  }
  resetObligo(){
    this.agentObligo=null;
  }
  setObligo(agent_id:number){
    this.obligationService.getObligation(agent_id).subscribe(res=>{
      if(res && !res['message']){
        this.agentObligo=res;
      }
      else{
        this. resetObligo();
      }
    });
  }
  resetProduct(){
    this.product=null;
    this.price=0.0;
    this.resetProductAgent(); 
  }
  resetProductAgent(){
    this.agent_price=0.0;
    this.product_agent=null; 
  }
  setProduct(product_id){
    this.productService.getProduct(product_id).subscribe(res=>{
      if(res && !res['message']){
        this.product=res;
        this.price=this.product.price.toFixed(2);
        this.setProductAgent(this.product.id,this.agent.id);
      }
      else{
        this. resetProduct();
      }
    });
  }
  setProductAgent(product_id:number,agent_id:number){
    this.productAgentService.getProductAgent(product_id,agent_id).subscribe(res=>{
      if(res && !res['message']){
        this.product_agent=res[0];
        let discount:number=this.product_agent.discount;
        let price:number=this.product.price;
        this.agent_price=(price-(0.01*price*discount)).toFixed(2);
      }
      else{
        this. resetProductAgent();
      }
    });
  }
  formOnInit(){
    let fb:any={
      'product_id':[null, Validators.required],
      'agent_id':[this.member.agent_id, Validators.required],
      'note':[''],
    };
    this.orderForm = this.formBuilder.group(fb);
  }
  
  resetAgent(){
    this.agent=new User();
    this.agent.id=0;
    this.agent._username='';
    this.resetObligo();
    this.resetProduct();
    this.orderForm.patchValue({
      product_id: null
    });
    this.orderForm.patchValue({
      agent_id: null
    });
  }
 
 _filterAgent(val: string): User[] {
  return this.agents.filter(option =>
    option._username.toLowerCase().indexOf(val.toLowerCase()) === 0);
}
searchAgent(event){
  this.agentSearch=true;
  if(event.key!='ArrowDown'){
    let search:string=event.target.value;
    if(search==''){
      this.filteredAgentOptions=null;
    }
    this.usersService.getAgentsSearch(search).subscribe(res=>{
      this.agentSearch=false;
      if(res && !res['message']){
        this.agents=res;
        this.filteredAgentOptions=this.orderForm.controls['agent_id'].valueChanges
        .startWith(null)
        .map(agent =>{
          if(agent && typeof agent === 'object'){
            this.takeAgent(agent._username);
            event.target.value='';
          }
          else{
            return  agent;
          }
        })
        .map(_username => _username? this._filterAgent(_username) : this.agents.slice());
      }
    });
  }
}
takeAgent(value:string):void{
  if ((value || '').trim()) {
    let filterAgents:User[];
    filterAgents = this.agents.filter(
      agent => agent._username=== value);
      if(filterAgents && filterAgents[0]){
        this.initSelectedAgent(filterAgents[0]);
      }
      else{
        this.initSelectedAgent();
      }
  }
}
initSelectedAgent(agent:any=null){
  if(agent==null){
    this.agent=new User();
    this.agent.id=0;
    this.agent._username='שייך לסוכן';
   
  }
  else if(typeof agent === 'object' && agent!=null && agent.id){
    this.agent=agent;
    this.orderForm.patchValue({
      agent_id: this.agent.id
    });
    this.setObligo(this.agent.id);
  }
  else{
    this.agent.id=0;
    this.agent._username='';
  }
}
chooseAgent(event){
  if(this.agent._username==''){
    this.initSelectedAgent();
    this.orderForm.value.agent_id={_username: "שייך לסוכן", id: 0};
  }
  event.target.value='';
}
displayAgentFn(agent:User): string {
  return agent ? agent._username :'';
}
save(){
  let new_order:Order=new Order();
  let fv=this.orderForm.value;
  new_order.agent_id=fv.agent_id;
  new_order.member_id=this.data.data.member.id;
  new_order.note=fv.note;
  new_order.product_id=fv.product_id;
  this.loading=true;
   this.orderService.add([new_order]).subscribe(res=>{
     this.loading=false;
     this.data.data.loadPhone(this.member.phone_id);
   });
  this.dialogRef.close();
}
onNoClick(){
  this.dialogRef.close();
}
}
