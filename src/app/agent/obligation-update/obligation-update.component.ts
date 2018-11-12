import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { ObligationService } from '../../users/obligation.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-obligation-update',
  templateUrl: './obligation-update.component.html',
  styleUrls: ['./obligation-update.component.css']
})
export class ObligationUpdateComponent implements OnInit {
  obligationForm:FormGroup;
  lan:any;
  constructor(public dialogRef: MdDialogRef<ObligationUpdateComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private obligationService:ObligationService,
    public snackBar: MatSnackBar,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-obligation-update');
     }
    ngOnInit() {
      this.formOnInit();
    }
    formOnInit(){
      let fb:any={
        'obligation':[this.data.agent.agent.obligation.obligation, Validators.required]
      };
      this.obligationForm = this.formBuilder.group(fb);
    }
    save(){
      let obj=this.obligationForm.value;
      obj.agent_id=this.data.agent.id;
     
      this.obligationService.edit(obj).subscribe(res=>{
        let body=JSON.parse(res['_body']);
        if(res && res['_body'] && body.message=="obligation was updated."){
          this.snackBar.open("עדכון מסגרת האשראי", "הצלחה", {
            duration: 5000,
          });
          this.data.agent.loadAgentData();
        }
        else{
          this.snackBar.open("עדכון מסגרת האשראי", "נכשל!!", {
            duration: 5000,
          });
        }
      });
      this.dialogRef.close();
    }
    onNoClick(){
      this.formOnInit();
      this.dialogRef.close();
    }
}
