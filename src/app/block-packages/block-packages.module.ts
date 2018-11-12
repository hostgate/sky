import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockPackagesComponent } from './block-packages/block-packages.component';
import { AddBlockComponent } from './add-block/add-block.component';
import { DeleteBlockComponent } from './delete-block/delete-block.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidErrModule } from '../valid-err/valid-err.module';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { YnModule } from '../pipes/yn.module';
import { ProductService } from '../product/product.service';
import { CompanyService } from '../company/company.service';
import { ExcelService } from '../excel.service';
import { AuthenticationService } from '../login/authentication.service';
import { BlockPackegesService } from './block-packeges.service';
import { UsersService } from '../users/users.service';

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
  declarations: [
    BlockPackagesComponent, 
    AddBlockComponent, 
    DeleteBlockComponent
  ],
  exports: [
    BlockPackagesComponent, 
    AddBlockComponent, 
    DeleteBlockComponent,
    TranslateModule,
    ValidErrModule,
  ],
  entryComponents: [
    AddBlockComponent, 
    DeleteBlockComponent
  ],
  providers:[
    {provide:BlockPackegesService,useClass:BlockPackegesService},
    {provide: ProductService, useClass: ProductService },
    {provide: CompanyService, useClass: CompanyService},
    {provide:UsersService,useClass:UsersService},
    TranslateService,
    {provide: ExcelService, useClass: ExcelService},
    AuthenticationService
  ]
})
export class BlockPackagesModule { }
