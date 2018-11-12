import { Component, Inject } from '@angular/core';
import { MdDialog, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { ValidationService } from "../../validation.service";
import { Product } from '../../model/product';
import { ProductService } from '../product.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  providers: [ValidationService]
})
export class EditProductComponent{
  item:Product;
  lan:any;
  constructor(public dialogRef: MdDialogRef<EditProductComponent>,
  @Inject(MD_DIALOG_DATA) public data: any,
  private productService:ProductService,private trans:TranslateService,
  private lsService:LocalStorageService,
  public authService:AuthenticationService) { 
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    this.dialogRef.afterClosed().subscribe(result => {});
  }
  onNoClick(): void {
    this.data.product.restProductForm();
    this.dialogRef.close();
  }
  save(id:number){
    this.item=this.data.product.productForm.value;
    this.item.id=id;
    this.productService.update(this.item).subscribe(res => {
      
      //this.data.product.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:this.item.name +' נשמר '});
      this.data.product.ngOnInit();
    });
    this.data.product.restProductForm();
    this.dialogRef.close();
  }
  
}
