import { Component, OnInit, Inject } from '@angular/core';
import { PaymentService } from '../payment.service';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { Payment } from '../../model/payment';
@Component({
  selector: 'app-add-rest',
  templateUrl: './add-rest.component.html',
  styleUrls: ['./add-rest.component.css']
})
export class AddRestComponent implements OnInit {

  constructor(private paymentService:PaymentService,
    public dialogRef: MdDialogRef<AddRestComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) { }

  ngOnInit() {
    this.formOnInit()
  }
  paymentForm:FormGroup;
  loading:Boolean=false;
  phone:string='';
  formOnInit(){
    this.phone=this.data.row.accepted_moved_to_phone=='0'?this.data.row.phone:this.data.row.moved_to_phone;
    let fb:any={
      'amount':[null,Validators.compose([this.validationService.numberValidation, Validators.required])],
      'related_to_date':[null, Validators.required],
      'note':[''],
      'rest_order':[this.data.row.id],
      'phone':[this.phone],
      'agent_id':[this.data.row.agent_id],
      'art':['rest'],
    };
    this.paymentForm = this.formBuilder.group(fb);
  }
  onNoClick(): void {
    this.loading=false;
    this.dialogRef.close();
  }
  save(){
    let item=this.paymentForm.value;
    let rest:any={}
    
    rest.agent_id=parseInt(item.agent_id);
    rest.amount=parseFloat(item.amount);
    rest.related_to_date=item.related_to_date;
    rest.phone=item.phone;
    rest.note=item.note;
    rest.art=item.art;
    rest.rest_order=item.rest_order;
    this.loading=true;
    // console.log(rest);
    this.paymentService.addRest(rest).subscribe(res=>{
      this.loading=false;
      this.dialogRef.close();
      this.data.data.ngOnInit();
    });
    
  }
}
