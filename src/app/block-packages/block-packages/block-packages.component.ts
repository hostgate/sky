import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl } from '@angular/material';
import { ProductService } from '../../product/product.service';
import { CompanyService } from '../../company/company.service';
import { ValidationService } from '../../validation.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { BlockPackegesService } from '../block-packeges.service';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { DeleteBlockComponent } from '../delete-block/delete-block.component';
import { AddBlockComponent } from '../add-block/add-block.component';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-block-packages',
  templateUrl: './block-packages.component.html',
  styleUrls: ['./block-packages.component.css']
})
export class BlockPackagesComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  blocks:any[];
  companies:any[];
  packages:any[];
  agents:any[];
  item:any;
  name: string;
  private sTimeout;
  public loading:Boolean=true;
  selectedValue:number;
  constructor(
    private blockPackegesService:BlockPackegesService,
    private productService:ProductService,
    private companyService:CompanyService,
    private usersService:UsersService,
    private validationService:ValidationService,
    public dialog: MdDialog,
    private router:Router,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService) { 
     
    }

    ngOnInit() {
      this.loadBlocks();
    }
    displayedColumns = [ 'createdAt','company','package','agent','id'];
    blocksDatabase = new DB([]);
    dataSource: DS | null;
    initBlocksDatabase(){
      this.blocksDatabase = new DB(this.blocks);
      this.dataSource = new DS(this.blocksDatabase, this.sort, this.paginator);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    }
    loadBlocks(){
      this.loading=true;
      this.blockPackegesService.get().subscribe(res=>{
        this.loading=false;
        this.blocks=res;
        this. initBlocksDatabase()
      });
      this.loadCompanies();
      this.loadPackages();
      this.loadAgents();
    }
    loadExcel(){
      let excel:any=[];
      this.dataSource.getFSData().forEach(el=>{
        let a:any={
          'id':el.id,
          'חברה':el.company,
          'חבילה':el.all_packages=='1'?'כל החבילות':el.package,
          'נקודת מכירה':el.agent,
          'פעיל':el.active=='1'?'כן':'לא'
        }
        excel.push(a);
      });
      this.excelService.exportAsExcelFile(excel, 'חסימות');
    }
    delete(block_package){
      let dialogRef=this.dialog.open(DeleteBlockComponent,{
        width:'310px',
        data:{ id: block_package.id,block_package:block_package,data:this }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.loadBlocks();
      });
    }
    active(row){
      this.loading=true;
      this.blockPackegesService.active(row.id).subscribe(res=>{
        this.loading=false;
        this.loadBlocks();
      });
    }
    openAddDialog(){
      let dialogRef = this.dialog.open(AddBlockComponent, {
        width: '250px',
        data: { data:this}
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    loadCompanies(){
      this.companyService.getCompanys().subscribe(res=>{
        this.companies=res;
      });
    }
    loadPackages(){
      this.productService.getProducts().subscribe(res=>{
        this.packages=res;
      });
    }
    loadAgents(){
      this.usersService.getAgents().subscribe(res=>{
        this.agents=res;
      });
    }
}
