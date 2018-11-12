import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../order.service';
import { UsersService } from '../../users/users.service';
import { MdDialogRef, MD_DIALOG_DATA,ENTER } from '@angular/material';
import { ValidationService } from '../../validation.service';
import {  FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../model/user';
import { Observable } from 'rxjs';
import { Order } from '../../model/order';
import { MemberService } from '../../member/member.service';
import { Member } from '../../model/member';
import { ProductService } from '../../product/product.service';
import { Product } from '../../model/product';
import { ObligationService } from '../../users/obligation.service';
import { Obligation } from '../../model/obligation';
import { ProductAgentService } from '../../product/product-agent.service';
import { ProductAgent } from '../../model/product_agent';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
const COMMA = 188;
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  loading:Boolean;
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  filteredAgentOptions:  Observable<any[]>=null;
  filteredMemberOptions:  Observable<Member[]>=null;
  memberSearch:Boolean=false;
  agentSearch:Boolean=false;
  orderForm:FormGroup;
  members:Member[]=[];
  member:Member=null;
  products:Product[]=[];
  product:Product=null;
  product_agent:ProductAgent=null;
  agents:User[];
  agent:User=null;
  agentObligo:Obligation=null;
  price:any=0;
  agent_price:any=0;
  lan:any;
  constructor(
      private orderService:OrderService,
      private usersService:UsersService,
      private obligationService:ObligationService,
      private memberService:MemberService,
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
      this.resetMember();
      this.initSelectedMember();
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-add');
    }
  ngOnInit() {
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
  formOnInit(order:Order){
    let fb:any={
      'member_id':order.member_id?[order.member_id, Validators.required]:[null, Validators.required],
      'product_id':order.product_id?[order.product_id, Validators.required]:[null, Validators.required],
      'agent_id':order.agent_id?[order.agent_id, Validators.required]:[null, Validators.required],
      'note':order.note?[order.note]:[''],
    };
    this.orderForm = this.formBuilder.group(fb);
  }
  resetMember(){
    this.products=[];
    this.resetObligo();
    this.resetProduct();
    this.member=new Member();
    this.member.id=0;
    this.member.phone='';
    this.formOnInit(new Order());
    
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
  _filterMember(val: string): Member[] {
    return this.members.filter(option =>
      option.phone.toLowerCase().indexOf(val.toLowerCase()) === 0);
 }
 _filterAgent(val: string): User[] {
  return this.agents.filter(option =>
    option._username.toLowerCase().indexOf(val.toLowerCase()) === 0);
}
  searchMember(event){
    this.memberSearch=true;
    if(event.key!='ArrowDown'){
      let search:string=event.target.value;
      if(search==''){
        this.filteredMemberOptions=null;
      }
      this.memberService.getNumbersMembers(search).subscribe(res=>{
        this.memberSearch=false;
        if(res && !res['message']){
          this.members=res;
          this.filteredMemberOptions = this.orderForm.controls['member_id'].valueChanges
          .startWith(null)
          .map(member =>{
            if(member && typeof member === 'object'){
              this.takeMember(member.phone);
              event.target.value='';
            }
            else{
              return  member;
            }
          })
          .map(phone => phone? this._filterMember(phone) : this.members.slice());
        }
      });
    }
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
          .map(_username => _username? this._filterMember(_username) : this.agents.slice());
        }
      });
    }
  }
  takeMember(value:string):void{
    if ((value || '').trim()) {
      let filterMembers:Member[];
      filterMembers = this.members.filter(
        member => member.phone=== value);
        if(filterMembers && filterMembers[0]){
          this.initSelectedMember(filterMembers[0]);
        }
        else{
          this.initSelectedMember();
        }
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
  initSelectedMember(member:any=null){
    if(member==null){
      this.member=new Member();
      this.member.id=0;
      this.member.phone='בחר מספר טלפון';
    }
    else if(typeof member === 'object' && member!=null && member.id){
      this.member=member;
      this.memberProducts(this.member);
        this.orderForm.patchValue({
          agent_id: this.member.agent_id
        });
        this.setObligo(this.member.agent_id);
        this.initSelectedAgent();
        this.usersService.getUser( this.member.agent_id).subscribe(res=>{
          if(res && !res['message']){
            this.agent=res;
          }
        });
      this.orderForm.patchValue({
        member_id: this.member.id
      });
     
    }
    else{
      this.member.id=0;
      this.member.phone='';
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
  chooseMember(event){
    if(this.member.phone==''){
      this.initSelectedMember();
      this.orderForm.value.member_id={phone: "בחר מספר טלפון", id: 0};
    }
    event.target.value='';
  }
  chooseAgent(event){
    if(this.agent._username==''){
      this.initSelectedAgent();
      this.orderForm.value.agent_id={_username: "שייך לסוכן", id: 0};
    }
    event.target.value='';
  }
  memberProducts(member:Member){
    if(member && member.company_id){
      let company=member.company_id;
      this.productService.getCompanyProducts(company).subscribe(res=>{
        if(res && !res['message']){
          this.products=res;
        }
      });
    }
  }
  displayMemberFn(member:Member): string {
    return member ? member.phone :'';
  }
  displayAgentFn(agent:User): string {
    return agent ? agent._username :'';
  }
  save(){
    let new_order:Order=new Order();
    let fv=this.orderForm.value;
    new_order.agent_id=fv.agent_id;
    new_order.member_id=fv.member_id;
    new_order.note=fv.note;
    new_order.product_id=fv.product_id;
    this.data.order.loading=true;
    this.orderService.add([new_order]).subscribe(res=>{
      this.orderService.getCountNewOrders().subscribe(response=>{
        this.lsService.setStorage('count_new_orders',response,99999999999);
      });
      this.data.order.loading=false;
      this.data.order.loadOrders();
    });
    this.resetMember();
    this.dialogRef.close();
  }
  onNoClick(){
    this.resetMember();
    this.dialogRef.close();
  }
}
