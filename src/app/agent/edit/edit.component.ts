import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { UsersService } from '../../users/users.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  agentForm:FormGroup;
  startDate = new Date(1980, 0, 1);
  lan:any;
  constructor(public dialogRef: MdDialogRef<EditComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private userService:UsersService,
    public snackBar: MatSnackBar,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-edit');
    }
    ngOnInit() {
      this.formOnInit();
    }
    formOnInit(){
      let agent=this.data.agent.agent;
      let fb:any={
        username: [agent.username, Validators.required],
        national_id: [agent.national_id, this.validationService.legalPersonalId],
        birthday: [agent.birthday],
        phone: [agent.phone, Validators.required],
        mobile: [agent.mobile, this.validationService.phoneValidation],
        email: [agent.email,  this.validationService.emailValidation],
      };
      this.agentForm = this.formBuilder.group(fb);
    }
    save(){
      let obj=this.agentForm.value;
      obj.id=this.data.agent.agent.id;
      obj.level_id=this.data.agent.agent.level_id;
      this.userService.update(obj).subscribe(res=>{
        let body=JSON.parse(res['_body']);
        if(res && res['_body'] && body.message=="user was updated."){
          this.snackBar.open("עדכון פרטים", "הצלחה", {
            duration: 5000,
          });
          this.data.agent.load();
        }
        else{
          this.snackBar.open("עדכון פרטים", "נכשל!!", {
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
