import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { EditComponent } from '../edit/edit.component';
import { MdDialog, MdPaginatorIntl } from '@angular/material';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { AgentService } from '../agent.service';

@Component({
  selector: 'app-agent-info',
  templateUrl: './agent-info.component.html',
  styleUrls: ['./agent-info.component.css']
})
export class AgentInfoComponent implements OnInit {
  lan:any;
  payment_art=null;
  constructor(
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private agentService:AgentService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-agent-info');
  }
  @Input() agent:any;
  @Input() public load: Function; 
  @ViewChild('fileInput') fileInput;
  ngOnInit() {
    this.payment_art=this.agent.payment_art;
  }
  openUpdate(){
    let dialogRef=this.dialog.open(EditComponent,{
      width:'310px',
      data:{agent:this}
    });
    dialogRef.afterClosed().subscribe(result=>{});
  }
  openPasswordUpdate(){
    let dialogRef=this.dialog.open(NewPasswordComponent,{
      width:'310px',
      data:{agent:this}
    });
    dialogRef.afterClosed().subscribe(result=>{});
  }
  changePaymentArt(payment_art){
    let art={
        id:this.agent.id,
        payment_art:payment_art
    };
    this.agentService.set_payment_art_change(art).subscribe(result=>{});
  }
  loading:Boolean=false;
  upload(){
    this.loading=true;
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.agentService.loadFile({file:fileBrowser.files[0],agent_id:this.agent.id}).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.agent.agreement=r['generatedName']; 
            this.loading=false;
          }
      });
    }
  }
}
