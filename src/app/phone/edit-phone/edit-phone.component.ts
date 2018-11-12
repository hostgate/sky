import { Component, OnInit, Inject } from '@angular/core';
import { Phone } from '../../model/phone';
import { User } from '../../model/user';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PhoneService } from '../phone.service';
import { UsersService } from '../../users/users.service';
import {MdChipInputEvent, ENTER} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MsgComponent } from '../../msg/msg.component';
const COMMA=188;

@Component({
  selector: 'app-edit-phone',
  templateUrl: './edit-phone.component.html',
  styleUrls: ['./edit-phone.component.css']
})
export class EditPhoneComponent{
  item:Phone;
  agents:User[];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  separatorKeysCodes = [ENTER, COMMA];
  filteredOptions: Observable<User[]>=null;
  load:Boolean=false;
  lan:any;
  products:any[]=null;
  constructor(
    public dialogRef: MdDialogRef<EditPhoneComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private phoneService:PhoneService,
    private usersService:UsersService,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    public snackBar: MatSnackBar){
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      this.selectedAgent= new User();
      this.usersService.getAgents().subscribe(res=>{
            if(!res['message']){
              this.agents=res;
              let filterAgents:User[];
              filterAgents = this.agents.filter(
                agent => agent.id== parseInt(this.data.phone.phoneForm.value.agent_id));
                if(filterAgents && filterAgents[0]){
                 this.initSelectedAgent(filterAgents[0]);
                }
                else{
                  this.initSelectedAgent();
                }
            }
      });
      this.matchProducts();
  }
  matchProducts(){
    this.products=null;
    let company_id=this.data.phone.phoneForm.value.company_id;
    this.products=this.data.phone.products.filter(el=>el.company_id==company_id);
  }
  onNoClick(): void {
    this.data.phone.restPhoneForm();
    this.dialogRef.close();
    this.data.phone.excelPhones=null;
  }
  _phones:any[]=[]
  save(){
    this.item=this.data.phone.phoneForm.value;
    let agent:any=this.item.agent_id;
    this.item.agent_id=agent.id;
    this.item.id=this.data.item.id;
    if(this.data.phone.excelPhones===null){
        this.phoneService.update(this.item).subscribe(res => {
        this.snackBar.openFromComponent(MsgComponent,{
          duration: 3000,
          horizontalPosition:'right',
          data:{title:'נשמר בהצלחה',detail:this.item.phone +' נשמר ',art:'edit',place:'phone'}
        });
        this.data.phone.loadPhones();
      });
    }
    else{
      this._phones=[];
      for(var i=0;i<this.data.phone.excelPhones.length;i++){
        this._phones.push({
          'phone':this.data.phone.excelPhones[i][0],
          'note':this.item.note,
          'agent_id':this.item.agent_id,
          'company_id':this.item.company_id,
          // 'product_id':this.item.product_id,
        });
      }
      this.data.loading=true;
      this.phoneService.add(this._phones).subscribe(res => {
        this.data.loading=false;
          this.data.phone.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:' נשמר '});
          this.data.phone.loadPhones();
      });
    }
    this.data.phone.restPhoneForm();
    this.dialogRef.close();
    this.data.phone.excelPhones=null;
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
  chooseAgent(event){
    if(this.selectedAgent._username==''){
      this.initSelectedAgent('free');
      this.data.phone.phoneForm.value.agent_id={_username: "לא משויך", id: 0};
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
  searchAgent(event){
    if(event.key!='ArrowDown'){
      let search:string=event.target.value;
      if(search==''){
        this.filteredOptions=null;
      }
      this.load=true;
      this.usersService.getAgentsSearch(search).subscribe(
        res=>{
          this.load=false;
          if(!res['message']){
            this.agents=res;
            this.filteredOptions = this.data.phone.phoneForm.controls['agent_id'].valueChanges
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
  compareWith(a:any,b:any){
    return parseInt(a)==parseInt(b);
  }

 

}
