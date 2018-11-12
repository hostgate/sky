import { Component, OnInit, Input } from '@angular/core';
import { AgentService } from '../agent.service';
import { MdSnackBar } from '@angular/material';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-price-change',
  templateUrl: './price-change.component.html',
  styleUrls: ['./price-change.component.css']
})
export class PriceChangeComponent implements OnInit {
  lan:any;
  constructor(
    private agentService:AgentService,
    public snackBar: MdSnackBar,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-price-change');
  
   }
  @Input() agent:any;
  @Input()
  public openMore: Function; 
  count_porducts_with_extension:number;
  get_count_blocked_members:number;
  ngOnInit() {
    //console.log(this.agent);
    this.agentService.getCountPorductsWithExtension(this.agent.id).subscribe(res=>{
      this.count_porducts_with_extension=res;
    });
    this.agentService.getCountBlockedMembers(this.agent.id).subscribe(res=>{
      this.get_count_blocked_members=res;
    });
  }
  change(e){
    let mes='הסוכן '+' יכול להעלות מחירי החבילות';
    if(!e.checked){
      mes='הסוכן '+' לא יכול להעלות מחירי החבילות';
    }
    let agent:any={id:this.agent.id,change_price:e.checked?'1':'0'};
    this.agentService.set_price_change(agent).subscribe(res=>{
      this.snackBar.open(mes, this.agent.username , {
        duration: 5000,
      });
      this.agent.change_price=this.agent.change_price==1?0:1;
    });
  }
  changeBlockMembers(e){
    let mes='סוכן יכול לחסום מנויים לאחרים';
    if(!e.checked){
      mes='סוכן לא יכול לחסום מנויים לאחרים';
    }
    let agent:any={id:this.agent.id,block_my_members:e.checked?'1':'0'};
    this.agentService.set_block_my_members(agent).subscribe(res=>{
      this.snackBar.open(mes, this.agent.username , {
        duration: 5000,
      });
      this.agent.block_my_members=this.agent.block_my_members==1?0:1;
    });
  }
  ResetPorductsWithExtension(){
    this.agentService.ResetPorductsWithExtension(this.agent).subscribe(res=>{
      this.ngOnInit()
    });
  }
  ResetBlockedMembers(){
    this.agentService.ResetBlockedMembers(this.agent).subscribe(res=>{
      this.ngOnInit()
    });
  }
  allowAccountException(e){
    
    let mes='נקודת המכירה תוכל לחרוג בחשבון';
    if(!e.checked){
      mes='נקודת המכירה לא תוכל לחרוג בחשבון';
    }
    this.agentService.allow_account_exception_f(this.agent).subscribe(res=>{
      this.snackBar.open(mes, this.agent.username , {
        duration: 5000,
      });
    });
  }
  receivingMessages(e){
    let mes='קבלת הודעות';
    if(!e.checked){
      mes='קבלת הודעות';
    }
    this.agentService.receiving_messages(this.agent).subscribe(res=>{
      this.snackBar.open(mes, this.agent.username , {
        duration: 5000,
      });
    });
  }
  isRent(e){
    let mes='משכיר';
    if(!e.checked){
      mes='משכיר';
    }
    this.agentService.is_rent(this.agent).subscribe(res=>{
      this.snackBar.open(mes, this.agent.username , {
        duration: 5000,
      });
    });
  }
}
