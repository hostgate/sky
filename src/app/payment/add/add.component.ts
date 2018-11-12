import { Component, OnInit, Inject } from '@angular/core';
import { PaymentService } from '../payment.service';
import { UsersService } from '../../users/users.service';
import { MdDialogRef, MD_DIALOG_DATA ,MdChipInputEvent, ENTER} from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../model/user';
import { Observable } from 'rxjs/Observable';
import { Payment } from '../../model/payment';
import { ValidationService } from '../../validation.service';
import { LangChangeEvent, TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
const COMMA = 188;
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  agents:User[];
  loading:Boolean;
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  filteredOptions: Observable<User[]>=null;
  lan:any;
  constructor(
              private paymentService:PaymentService,
              private usersService:UsersService,
              public dialogRef: MdDialogRef<AddComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,
              private validationService:ValidationService,
              private formBuilder:FormBuilder,
              private trans:TranslateService,
              private lsService:LocalStorageService,
              public authService:AuthenticationService
              ) 
  {
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    this.loading=this.data.payment.loading;
    if(!this.data.edit){
      this.formOnInit(new Payment());
      this.initSelectedAgent();
    }
    else{
      this.selectedAgent=new User();
      this.selectedAgent.id=this.data.value.agent_id;
      this.selectedAgent._username=this.data.value.agent_name;
      this.setPaymentForm(this.data.value);
    }
  }
  paymentForm:FormGroup;
  ngOnInit() {
    this.loading=true;
    this.usersService.getAgents().subscribe(res=>{
      this.loading=false;
      if(res && !res['message']){
        this.agents=res;
      }
    });
  }
  item:any;
  btnOff(){
    return !this.paymentForm.valid || !this.paymentForm.value.agent_id || (this.paymentForm.value.agent_id && !this.paymentForm.value.agent_id.id)
  }
  save(){
    this.item=this.paymentForm.value;
    let payment:Payment=new Payment();
    payment.id=null;
    if(this.item.id){
      payment.id=parseInt(this.item.id);
    }
    payment.agent_id=parseInt(this.item.agent_id.id);
    payment.amount=parseFloat(this.item.amount);
    payment.related_to_date=this.item.related_to_date;
    payment.note=this.item.note;
    payment.art=this.item.art;
    payment.shek_number=this.item.shek_number;
    payment.bank_branch=this.item.bank_branch;
    payment.bank_name=this.item.bank_name;
    payment.shek_maturity_date=this.item.shek_maturity_date;
    payment.bs_bank=this.item.bs_bank;
    if(this.item.id){
      this.data.payment.editPayment(payment);
    }
    else{
      this.data.payment.addPayment(payment);
    }
    
    this.formOnInit(new Payment());
    this.dialogRef.close();
  } 
  resetUser(){
     this.selectedAgent=new User();
     this.selectedAgent.id=0;
     this.selectedAgent._username='';
    this.paymentForm.value.agent_id=null;
  }
  onNoClick(): void {
    this.edit=false;
    this.formOnInit(new Payment());
    this.dialogRef.close();
  }
  compareWith(a:any,b:any){
    return parseInt(a)==parseInt(b);
  }
  _filter(val: string): User[] {
    return this.agents.filter(option =>
      option._username.toLowerCase().indexOf(val.toLowerCase()) === 0);
 }
  displayFn(agent:User): string {
    return agent ? agent._username :'';
  }
  initSelectedAgent(agent:any=null){
    if(agent==null){
      this.selectedAgent=new User();
      this.selectedAgent.id=0;
      this.selectedAgent._username='';
    }
    else if(typeof agent === 'object' && agent!=null && agent.id){
      this.selectedAgent.id=agent.id;
      this.selectedAgent._username=agent._username;
    }
    else{
      this.selectedAgent.id=0;
      this.selectedAgent._username=agent;
    }
  }
  formOnInit(payment:Payment){
    this.edit=false;
    let fb:any={
      'amount':payment.amount?[payment.amount, Validators.compose([this.validationService.numberValidation, Validators.required])]:[null,Validators.compose([this.validationService.numberValidation, Validators.required])],
      'art':payment.art?[null, Validators.required]:[null, Validators.required],
      'related_to_date':payment.related_to_date?[payment.related_to_date, Validators.required]:[null, Validators.required],
      'agent_id':payment.agent_id?[payment.agent_id, Validators.required]:[null, Validators.required],
      'note':payment.note?[payment.note]:[''],
      'shek_number':payment.shek_number?[payment.shek_number]:[''],
      'bank_branch':payment.bank_branch?[payment.bank_branch]:[''],
      'bank_name':payment.bank_name?[payment.bank_name]:[''],
      'shek_maturity_date':payment.shek_maturity_date?[payment.shek_maturity_date]:[''],
      'bs_bank':payment.bs_bank?[payment.bs_bank]:[''],
    };
    this.paymentForm = this.formBuilder.group(fb);
  }
  edit:Boolean=false;
  setPaymentForm(p:any){
    let art:any;
    if(p.art=="shek") art=0;
    else if(p.art=="promotional")art=1;
    else if(p.art=="bank_transfer")art=4;
    else if(p.art=="standing_order")art=5;
    else art=2;
    this.edit=true;
    let fb:any={
      'id':[p.id, Validators.required],
      'amount':[p.amount, Validators.compose([this.validationService.numberValidation, Validators.required])],
      'art':[art, Validators.required],
      'related_to_date':[p.related_to_date, Validators.required],
      'agent_id':[this.selectedAgent, Validators.required],
      'note':[p.note],
      'shek_number':[p.shek_number],
      'bank_branch':[p.bank_branch],
      'bank_name':[p.bank_name],
      'shek_maturity_date':[p.shek_maturity_date],
      'bs_bank':[p.bs_bank],
    };
    this.paymentForm = this.formBuilder.group(fb);
  }
  chooseAgent(event){
    if(this.selectedAgent._username==''){
      this.initSelectedAgent('free');
      this.paymentForm.value.agent_id={_username: "לא משויך", id: 0};
    }
    event.target.value='';
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
          this.initSelectedAgent('free');
        }
    }
  }
  agentSearch:Boolean=false;
  searchAgent(event){
    this.agentSearch=true;
    if(event.key!='ArrowDown'){
      let search:string=event.target.value;
      if(search==''){
        this.filteredOptions=null;
      }
      this.usersService.getAgentsSearch(search).subscribe(
        res=>{
          this.agentSearch=false;
          if(!res['message']){
            this.agents=res;
            this.filteredOptions = this.paymentForm.controls['agent_id'].valueChanges
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
              .map(_username => _username? this._filter(_username) : this.agents.slice());
          }
        }
      );
    }
  }
}