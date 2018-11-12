import { Component, OnInit, Inject, ViewChild ,NgModule} from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA ,MdChipInputEvent, ENTER} from '@angular/material';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ValidationService } from '../../validation.service';
import { LangChangeEvent, TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { AgentService } from '../agent.service';

@Component({
  selector: 'app-add-agreement',
  templateUrl: './add-agreement.component.html',
  styleUrls: ['./add-agreement.component.css']
})
export class AddAgreementComponent implements OnInit {
  lan:any;
  loading:Boolean;
  public title:string='';
  fileBrowser:any=null;
  fileName:string=null;
  @ViewChild('fileInput') fileInput;
  constructor( public dialogRef: MdDialogRef<AddAgreementComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private agentService:AgentService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
     }

  ngOnInit() {
    this.fileName=null;
  }
  public valid(){
   if (this.fileBrowser && this.fileBrowser.files && this.fileBrowser.files[0]) {
    return this.title && this.title!='' && this.fileBrowser.files && this.fileBrowser.files[0];
   }
   return false;
  }
  upload(){
    this.loading=true;
    if (this.fileBrowser.files && this.fileBrowser.files[0]) {
      this.agentService.loadAgreement({file: this.fileBrowser.files[0],add_by:this.authService.getCurrentUserId(),agent_id:this.data.agent.id,title:this.title}).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.loading=false;
            this.data.data.ngOnInit();
          }
      });
        this.loading=false;
    }
    this.dialogRef.close();
  }
  saveFile(){
    this.fileName=null;
    this.fileBrowser = this.fileInput.nativeElement;
    this.fileName=this.fileBrowser.files[0].name;
   
  }
  restFile(){
    this.fileName=null;
    this.fileBrowser =null;
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
