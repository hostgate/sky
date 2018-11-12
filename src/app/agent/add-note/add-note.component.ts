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
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent implements OnInit {
  lan:any;
  loading:Boolean;
  public note:string='';
  @ViewChild('fileInput') fileInput;
  constructor( public dialogRef: MdDialogRef<AddNoteComponent>,
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
    ngOnInit() {}
    public valid(){return this.note && this.note!='';}
    save(){
      this.loading=true;
      this.agentService.addNote({agent_id:this.data.agent.id,note:this.note}).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.loading=false;
            this.data.data.ngOnInit();
          }
      });
      this.loading=false;
      this.dialogRef.close();
    }
    onNoClick(){
      this.dialogRef.close();
    }
}