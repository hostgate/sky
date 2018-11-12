import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProductService } from '../product.service';
import { AuthenticationService } from '../../login/authentication.service';
import { ValidationService } from '../../validation.service';
import {  FormControl, Validators, FormBuilder, FormGroup ,NgModel } from '@angular/forms';

@Component({
  selector: 'app-edit-profit',
  templateUrl: './edit-profit.component.html',
  styleUrls: ['./edit-profit.component.css']
})
export class EditProfitComponent implements OnInit {
  profitForm:FormGroup;
  constructor(
    public dialogRef: MdDialogRef<EditProfitComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private productService:ProductService,
    public authService:AuthenticationService,
    private validationService:ValidationService,
    private formBuilder:FormBuilder) {
      let fb:any={
        'profit':[this.data.product.profit,  Validators.required],
        
      };
      
      
      this.profitForm = this.formBuilder.group(fb);
     }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(){
    let row=this.data.product;
    row.profit=Math.floor(parseFloat(this.profitForm.value.profit));
    if(row.profit<0)row.profit=0;
    row.all=row.profit+row.product_price;
    this.productService.updateProfit(row).subscribe();
    this.dialogRef.close();
  }
  ngOnInit(){
    
  }

}
