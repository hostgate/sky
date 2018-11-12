import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent, DeleteDialog } from './product/product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from "./../company/company.service";
import { ProductService } from "./product.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from "../valid-err/valid-err.module";
import { TranslateService, TranslateModule } from "ng2-translate";
import { MdNativeDateModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material.module';
import { YnModule } from '../pipes/yn.module';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
import { PriceListComponent } from './price-list/price-list.component';
import { EditProfitComponent } from './edit-profit/edit-profit.component';
import { BlockPackegesService } from '../block-packages/block-packeges.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ValidErrModule,
    TranslateModule,
    MaterialModule,
    RouterModule,
    YnModule
  ],
  exports : [
    ProductComponent,
    AddProductComponent,
    EditProductComponent,
    TranslateModule,
    ValidErrModule,
    DeleteDialog, 
    PriceListComponent, 
    EditProfitComponent
  ],
  declarations: [
    ProductComponent, 
    AddProductComponent, 
    EditProductComponent,
    DeleteDialog, 
    PriceListComponent, 
    EditProfitComponent
  ],
  providers:[
    { 
      provide: ProductService, useClass: ProductService 
    },
    { 
      provide: CompanyService, useClass: CompanyService 
    },
    TranslateService,
    { 
      provide: ExcelService, useClass: ExcelService 
    },
    { provide :BlockPackegesService,useClass:BlockPackegesService},
    AuthenticationService
  ],
  entryComponents: [
    AddProductComponent,
    EditProductComponent,
    DeleteDialog, 
    PriceListComponent, 
    EditProfitComponent
  ],
})
export class ProductModule { }
