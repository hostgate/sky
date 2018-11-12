import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { UsersService } from '../../users/users.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  passForm:FormGroup;
  lan:any;
  constructor(public dialogRef: MdDialogRef<NewPasswordComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private userService:UsersService,
    public snackBar: MatSnackBar,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService,
   private router:Router) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-new-password');
     }
  ngOnInit() {
    this.formOnInit();
  }
  formOnInit(){
    let fb:any={
      'old_pass':[null, Validators.required],
      'new_pass':[null, Validators.required],
      're_new_pass':[null, Validators.required]
    };
    this.passForm = this.formBuilder.group(fb);
  }
  save(){
    let obj=this.passForm.value;
    obj.id=this.data.agent.agent.id;
    this.userService.updatePass(obj).subscribe(res=>{
      let body=JSON.parse(res['_body']);
      if(res && res['_body'] && body.message=="user was updated."){
        if(this.authService.isAgent()){
          this.router.navigate(['/התחברות']);
        }
        else{
          this.data.agent.load();
        }
        this.snackBar.open("עדכון סיסמא", "הצלחה", {
          duration: 5000,
        });
      }
      else{
        this.snackBar.open("עדכון סיסמא", "נכשל!!", {
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
