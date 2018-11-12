import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { PaymentService } from '../../payment/payment.service';
import { Payment } from '../../model/payment';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css']
})
export class AddPaymentComponent implements OnInit {
  paymentForm:FormGroup;
  id:number=null;
  loading:boolean=false;
  lan:any;
  constructor(public dialogRef: MdDialogRef<AddPaymentComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    private paymentService:PaymentService,
    public snackBar: MatSnackBar,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-add-payment');
    }
    ngOnInit(){this.id=this.data.id;this.formOnInit();}
    payment_art:any;
    formOnInit(){
      let payment= new Payment();
      if(this.id && this.id>0){
        payment=this.data.agent.agent.payments.filter(payment => payment.id==this.id)[0];
      }
      let a:any=payment.art;
      if(a=="shek") {this.payment_art=0};
      if(a=="credit") {this.payment_art=1};
      if(a=="cash") {this.payment_art=2};
      let fb:any={
        'art':[this.payment_art,  Validators.required],
        'amount':[payment.amount, Validators.compose([this.validationService.numberValidation, Validators.required])],
        'related_to_date':[payment.related_to_date, Validators.required],
        'note':[payment.note],
        'shek_number':[payment.shek_number],
        'bank_branch':[payment.bank_branch],
        'bank_name':[payment.bank_name],
        'shek_maturity_date':[payment.shek_maturity_date],
      };
      this.paymentForm = this.formBuilder.group(fb);
    }
    compareWith(a:any,b:any){
      if(b=='shek')b=0;
      if(b=='credit')b=1;
      if(b=='cash')b=2;
      return parseInt(a)==parseInt(b);
    }
    onNoClick(){
      this.formOnInit();
      this.dialogRef.close();
    }
    save(id){
      let obj=this.paymentForm.value;
      obj.agent_id=this.data.agent.id;
      if(id>0){
        obj.id=id;
        this.paymentService.update(obj).subscribe(res=>{
          let body=JSON.parse(res['_body']);
          if(res && res['_body'] && body.message=="payment was updated."){
            this.snackBar.open("עדכון תשלום", "הצלחה", {
              duration: 5000,
            });
            this.data.agent.loadAgentData();
          }
          else{
            this.snackBar.open("עדכון תשלום", "נכשל!!", {
              duration: 5000,
            });
          }
        });
      }
      else{
        this.paymentService.add([obj]).subscribe(res=>{
          let body=JSON.parse(res['_body']);
          if(res && res['_body'] && body.message=="payment was created."){
            this.snackBar.open("הוספת תשלום", "הצלחה", {
              duration: 5000,
            });
            this.data.agent.loadAgentData();
          }
          else{
            this.snackBar.open("הוספת תשלום", "נכשל!!", {
              duration: 5000,
            });
          }
        });
      }
      this.dialogRef.close();
    }
}