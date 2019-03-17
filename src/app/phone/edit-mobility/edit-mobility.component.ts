import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PhoneService } from '../phone.service';
import { UsersService } from '../../users/users.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-mobility',
  templateUrl: './edit-mobility.component.html',
  styleUrls: ['./edit-mobility.component.css']
})
export class EditMobilityComponent implements OnInit {
  lan:any;
  mobilityForm:FormGroup;
  loading:Boolean=false;
  constructor(
    public dialogRef: MdDialogRef<EditMobilityComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private phoneService:PhoneService,
    private usersService:UsersService,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    public snackBar: MatSnackBar){
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  ngOnInit() {
    this.formOnInit(this.data.row);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  formOnInit(row){
    let fb:any={
      'phone':[row.phone, Validators.required],
      'moved_to_phone':[row.moved_to_phone],
      'accepted_moved_to_phone':[row.accepted_moved_to_phone=='1'?true:false],
    };
    this.mobilityForm = this.formBuilder.group(fb);
  }
  save(){
    let data=this.mobilityForm.value;
    data.id=this.data.row.id;
    data.accepted_moved_to_phone=data.accepted_moved_to_phone?'1':'0';
    this.loading=true;
    this.phoneService.updateMobility(data).subscribe(res=>{
      this.loading=false;
      this.dialogRef.close();
    });
  }
}
