import { Component, OnInit, Inject } from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ValidationService } from '../../validation.service';
import { SettingsService } from '../settings.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  settingsForm:FormGroup;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<EditComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private validationService:ValidationService,
    private settingsService:SettingsService,private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      this.settingsFormInt();
     }
  settingsFormInt(){
    this.settingsForm = this.formBuilder.group({
      value: [this.data.item._value, Validators.required],
      active: [this.data.item.active=='1'],
    });
  }
  ngOnInit() {
   
  }
  save(){
    let setting=this.data.item;
    setting._value=this.settingsForm.value.value;
    setting.active=this.settingsForm.value.active;
    this.settingsService.update(setting).subscribe(res=>{
      this.data.this.loadSettings();
      this.dialogRef.close();
    });
    
    
  }
  onNoClick(): void {
    this.data.this.loadSettings();
    this.dialogRef.close();
  }
}
