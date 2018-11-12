import { Component,Inject} from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef, MatSnackBar } from '@angular/material';
import { ValidationService } from "../../validation.service";
import { Sim } from '../../model/sim';
import { SimService } from '../sim.service';
import { UsersService } from '../../users/users.service';
import { User } from '../../model/user';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MsgComponent } from '../../msg/msg.component';
@Component({
  selector: 'app-add-sim',
  templateUrl: './add-sim.component.html',
  styleUrls: ['./add-sim.component.css'],
  providers: [ValidationService]
})
export class AddSimComponent  {
  item:Sim;
  agents:User[];
  load:Boolean=false;
 // _agents:User[];
  filteredOptions: Observable<User[]>=null;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<AddSimComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private simService:SimService,
    private usersService:UsersService,private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    public snackBar: MatSnackBar)
     {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
    _filter(val: string): User[] {
      return this.agents.filter(option =>
        option._username.toLowerCase().indexOf(val.toLowerCase()) === 0);
   }
    displayFn(agent:User): string {
      return agent ? agent._username :'';
    }
    test(e){
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
                .map(agent => agent && typeof agent === 'object' ? agent._username : agent)
                .map(_username => _username? this._filter(_username) : this.agents.slice());
              }
          }
        );
      }
    }
    chooseAgent(event){}
    onNoClick(): void {
      this.data.sim.restSimForm();
      this.dialogRef.close();
      this.data.sim.excelSims=null;
    }
    _sims:any[]=[]
    save(){
      this.item=this.data.sim.simForm.value;
      let agent=this.data.sim.simForm.value.agent_id;
      this.item.agent_id=agent.id;
      if(this.data.sim.excelSims===null){
          this.simService.add([this.item]).subscribe(res => {
          this.data.sim.sims.push(this.item);
          //this.data.sim.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:this.item.sim +' נשמר '});
          this.snackBar.openFromComponent(MsgComponent,{
            duration: 3000,
            horizontalPosition:'right',
            data:{title:'נשמר בהצלחה',detail:this.item.sim +' נשמר ',art:'add',place:'sim'}
          });
          this.data.sim.loadSims();
        });
      }
      else{
        this._sims=[];
        for(var i=0;i<this.data.sim.excelSims.length;i++){
          this._sims.push({
            'sim':this.data.sim.excelSims[i][0],
            'note':this.item.note,
            'agent_id':this.item.agent_id,
            'company_id':this.item.company_id
          });
        }
        this.simService.add(this._sims).subscribe(res => {
           // this.data.sim.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:' נשמר '});
            this.snackBar.openFromComponent(MsgComponent,{
              duration: 3000,
              horizontalPosition:'right',
              data:{title:'נשמר בהצלחה',detail:' נשמר ',art:'add',place:'sim'}
            });
            this.data.sim.loadSims();
        });
      }
      this.data.sim.restSimForm();
      this.dialogRef.close();
      this.data.sim.excelSims=null;
    }
}
