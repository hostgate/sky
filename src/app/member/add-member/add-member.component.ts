import { Component, OnInit, Inject } from '@angular/core';
import { MemberService } from '../member.service';
import { MdDialogRef, MD_DIALOG_DATA ,MdChipInputEvent, ENTER} from '@angular/material';
import { UsersService } from '../../users/users.service';
import { ConsumerService } from '../../consumer/consumer.service';
import { CompanyService } from '../../company/company.service';
import { SimService } from '../../sim/sim.service';
import { PhoneService } from '../../phone/phone.service';
import { Company } from '../../model/company';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Member } from '../../model/member';
import { User } from '../../model/user';
import { Observable } from 'rxjs/Observable';
import { Consumer } from '../../model/consumer';
import { Phone } from '../../model/phone';
import { Sim } from '../../model/sim';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { ProductService } from '../../product/product.service';
const COMMA = 188;
@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  companies:Company[];
  agents:User[];
  memberForm:FormGroup;
  loading:Boolean;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  consumers:Consumer[];
  separatorKeysCodes = [ENTER, COMMA];
  CompanyData:any;
  company_id:number=null;
  _sims:Sim[];
  filteredOptions: Observable<User[]>=null;
  phones:Phone[];
  sims:Observable<Sim[]>=null;
  lan:any;
  block_others_agents:Boolean=true;
  products:any[]=null;
  loadProducts(company_id){
    this.productService.getCompanyProducts(company_id).subscribe(res=>{
      if(res && !res['message']){
        this.products=res;
       // console.log(res);
      }
    });
  }
  constructor(private memberService:MemberService,
              private usersService:UsersService,
              private consumerService:ConsumerService,
              private simService:SimService,
              private phoneService:PhoneService,
              public dialogRef: MdDialogRef<AddMemberComponent>,
              @Inject(MD_DIALOG_DATA) public data: any,private formBuilder:FormBuilder,
              private trans:TranslateService, private lsService:LocalStorageService,
              private companyService:CompanyService,
              public authService:AuthenticationService,
              private productService:ProductService
   
  ) {
   
      this.lan=this.lsService.getStorage('lan');
  
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    let m:Member=new Member();
    if(this.data.phone){
      m.phone_id=this.data.phone.id;
      m.company_id=this.data.phone.company_id;
      this.phoneService.getPhone(this.data.phone.id).subscribe(res=>{
        this.phones=[res];
      });
    }
    this.data.member.formOnInit(m);
    
   
    this.companies=this.data.member.companies;
    if(this.data.phone){
      this.companyService.getCompanys().subscribe(res=>{
        this.companies=res.filter(el=>el.id=this.data.phone.company_id);
      });
    }
    this.memberForm=this.data.member.memberForm;
    this.loading=false;//this.data.member.loading;
    
    
      this.initSelectedAgent();
      localStorage.setItem('currentComponent','app-add-member');
   }
   phonesNotFound:Boolean;
   initCompanyData(value){
      this.phonesNotFound=false;
      this.phones=null;
      if(this.data.phone){
        this.memberForm.patchValue({sim_id: null});
        this.memberForm.patchValue({phone_id: this.data.phone.id});
        this.company_id=this.data.phone.company_id;
      }
      else{
      
        this.memberForm.patchValue({sim_id: null});
        this.memberForm.patchValue({phone_id: null});
        this.company_id=value;
        
      }
      this.loadProducts(this.company_id);
      this.phoneService.getNotUsedAgentCompanyPhones(this.selectedAgent.id,this.company_id).subscribe(res=>{
        if(!res['message']){
          this.phones=res;
        }
        else{
          this.phonesNotFound=true;
        }
      });
   }
  ngOnInit() {
    if(this.authService.isAgent()){
      this.usersService.getUser(this.authService.getCurrentUserId()).subscribe(agent=>{
        this.block_others_agents=(agent.block_my_members=='1');
      });
    }
    if(this.authService.isAgent()){
      this.usersService.getUser(this.authService.getCurrentUserId()).subscribe(agent=>{
        this.initSelectedAgent(agent);
        this.memberForm.patchValue({agent_id:agent});
      });
    }
    else{
      this.initSelectedAgent();
    }
  }
  __filter(val: string): Sim[] {
    return this._sims.filter(option =>
      option.sim.toLowerCase().indexOf(val.toLowerCase()) === 0);
 }
  displayFnSim(sim:Sim): string {
    return sim ? sim.sim :'';
  }
  test(e){
  }
 
  simSearch:Boolean=false;
  searchSim(event){
    this.simSearch=true;
    if(event.key!='ArrowDown'){
      
    let search1:string=event.target.value;
    if(search1==''){
      this.sims=null;
    }
    if(this.data.phone){
      this.company_id=this.data.phone.company_id;
    }
    this.simService.getSearchNotUsedAgentCompanySims(this.selectedAgent.id,this.company_id,search1).subscribe(
        res=>{
          
     this.simSearch=false;
            if(!res['message']){
              this._sims=res;
              this.sims = this.memberForm.controls['sim_id'].valueChanges
              .startWith(null)
              .map(sim => sim && typeof sim === 'object' ? sim.sim : sim)
              .map(sim => sim? this.__filter(sim) : this._sims.slice());
            }
        }
      );
    }
  }
  chooseSim(event){
  }
  onNoClick(): void {
    this.data.member.formOnInit(new Member());
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
  resetUser(){
    this.selectedAgent=new User();
    this.selectedAgent.id=0;
    this.selectedAgent._username='';
    let company_id=null;
    let phone_id=null;
    if(this.data.phone){
      company_id=this.data.phone.company_id;
      phone_id=this.data.phone.id;
      
    }
    //let agent_id=null;
    
    let fb:any={
      'agent_id':[null, Validators.required],
      'consumer_id':[null, Validators.required],
      'company_id':[company_id, Validators.required],
      'sim_id':[null, Validators.required],
      'phone_id':[phone_id, Validators.required],
      'moved':[false],
      'moved_to_phone':['0'],
      'free':[true],
      'with_order':[false],
      'product_id':[null],
      'note':[''],
    };
    this.memberForm = this.formBuilder.group(fb);
    this.consumersNotFound=false;
  }
  consumersNotFound:Boolean;
  initSelectedAgent(agent:any=null){
    this.consumersNotFound=false;
    if(agent==null){
      this.selectedAgent=new User();
      this.selectedAgent.id=0;
      this.selectedAgent._username='';     
    }
    else if(typeof agent === 'object' && agent!=null && agent.id){
      this.selectedAgent.id=agent.id;
      this.selectedAgent._username=agent._username;
      this.consumerService.getAgentConsumers(this.selectedAgent.id).subscribe(res=>{
        if(!res['message']){
          this.consumers=res;
        }
        else{
          this.consumersNotFound=true;
        }
      });
    }
    else{
      this.selectedAgent.id=0;
      this.selectedAgent._username=agent;
    }
  }
  chooseAgent(event){
    if(this.selectedAgent._username==''){
      this.initSelectedAgent('free');
      this.memberForm.value.agent_id={_username: "לא משויך", id: 0};
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
            this.filteredOptions = this.memberForm.controls['agent_id'].valueChanges
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
  item:any;
  save(){
    this.item=this.memberForm.value;
    let member:Member=new Member();
    member.id=null;
    member.agent_id=parseInt(this.item.agent_id.id);
    member.sim_id=parseInt(this.item.sim_id.id);
    member.company_id=this.item.company_id;
    member.phone_id=this.item.phone_id;
    member.free=this.item.free;
    member.moved=this.item.moved;
    member.moved_to_phone=this.item.moved_to_phone;
    member.note=this.item.note;
    member.consumer_id=this.item.consumer_id;
    if(this.data.phone){
      this.data.member.addMember2(member);
    }
    else{
      this.data.member.addMember(member);
    }
    this.resetUser();
    this.dialogRef.close();
  }  
}
