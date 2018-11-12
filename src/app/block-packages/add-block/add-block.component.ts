import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { LocalStorageService } from '../../local-storage.service';
import { TranslateService } from 'ng2-translate';
import { BlockPackegesService } from '../block-packeges.service';

@Component({
  selector: 'app-add-block',
  templateUrl: './add-block.component.html',
  styleUrls: ['./add-block.component.css']
})
export class AddBlockComponent implements OnInit {
  agents:any[];
  companies:any[];
  packages:any[];

  blockForm:FormGroup;
  constructor(
    public dialogRef: MdDialogRef<AddBlockComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private formBuilder:FormBuilder,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    private blockPackegesService:BlockPackegesService,
  ) {
      this.agents=this.data.data.agents;
      this.companies=this.data.data.companies;
      this.packages=this.data.data.packages;
      this.initForm();
   }

  ngOnInit() {
  }
  initForm(){
    let fb:any={
      'agent_id':[null, Validators.required],
      'company_id':[null, Validators.required],
      'all_packages':[false, Validators.required],
      'package_id':[null]
    };
    this.blockForm = this.formBuilder.group(fb);
  }
  resetPackages(){
    this.blockForm.patchValue({'package_id':null});
    this.blockForm.value.package_id=null;
  }
  resetAllPackages(){
    this.blockForm.patchValue({'all_packages':false}); 
    this.resetPackages();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(){
    let data=this.blockForm.value;
    if(!data.package_id)data.package_id=0;
    if(!data.all_packages){
      data.all_packages='0';
    }
    else{
      data.all_packages='1';
      data.package_id=0;
    }
    this.blockPackegesService.add(data).subscribe(res=>{
      this.data.data.loadBlocks();
      this.dialogRef.close();
    });
  }
}
