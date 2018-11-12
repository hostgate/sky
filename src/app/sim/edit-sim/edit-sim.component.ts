import { Component, Inject, ViewChild } from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef, MatSnackBar } from '@angular/material';
import { ValidationService } from "../../validation.service";
import { Sim } from '../../model/sim';
import { SimService } from '../sim.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../model/user';
import {MdChipInputEvent, ENTER} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MsgComponent } from '../../msg/msg.component';
const COMMA = 188;
@Component({
  selector: 'app-edit-sim',
  templateUrl: './edit-sim.component.html',
  styleUrls: ['./edit-sim.component.css'],
  providers: [ValidationService]
})
export class EditSimComponent{
  item:Sim;
  agents:User[];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  selectedAgent: User;
  separatorKeysCodes = [ENTER, COMMA];
  load:Boolean=false;
  filteredOptions: Observable<User[]>=null;
  lan:any;
  constructor(public dialogRef: MdDialogRef<EditSimComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private simService:SimService,
    private usersService:UsersService,private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    public snackBar: MatSnackBar) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      this.selectedAgent= new User();
      this.selectedAgent.id=0;
      this.selectedAgent._username='free';
      this.usersService.getAgents().subscribe(
        res=>{
            if(!res['message']){
              this.agents=res;
              let filterAgents:User[];
              filterAgents = this.agents.filter(
                agent => agent.id== parseInt(this.data.sim.simForm.value.agent_id));
                if(filterAgents && filterAgents[0]){
                 this.initSelectedAgent(filterAgents[0]);
                }
                else{
                  this.initSelectedAgent();
                }
            }
        }
      );
    }
    onNoClick(): void {
      this.data.sim.restSimForm();
      this.dialogRef.close();
    }
    compareWith(a:any,b:any){
      return parseInt(a)==parseInt(b);
    }
    save(id:number){
      this.item=this.data.sim.simForm.value;
      let agent=this.data.sim.simForm.value.agent_id;
      this.item.agent_id=agent.id;
      this.item.id=id;
      this.simService.update(this.item).subscribe(res => {
        this.data.sim.sims.push(this.item);
       // this.data.sim.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:this.item.sim +' נשמר '});
        this.snackBar.openFromComponent(MsgComponent,{
          duration: 3000,
          horizontalPosition:'right',
          data:{title:'נשמר בהצלחה',detail:this.item.sim +' נשמר ',art:'edit',place:'sim'}
        });
        this.data.sim.loadSims();
      });
      this.data.sim.restSimForm();
      this.dialogRef.close();
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
        this.data.sim.simForm.value.agent_id={_username: "לא משויך", id: 0};
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
              this.filteredOptions = this.data.sim.simForm.controls['agent_id'].valueChanges
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
