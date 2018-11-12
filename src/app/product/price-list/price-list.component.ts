import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from './../product.service';
import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { EditProfitComponent } from '../edit-profit/edit-profit.component';
import { BlockPackegesService } from '../../block-packages/block-packeges.service';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']
})
export class PriceListComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  allow_to_change_price:Boolean=false;
  public loading:Boolean;
  price_list:any[]=null;
  products:any[];
  lan:any;
  constructor(
    private productService:ProductService,
    private validationService:ValidationService,
    private router:Router,
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService,
    private blockPackegesService:BlockPackegesService
  ) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-price-list');
      
  }
  ngOnInit() {
    this.blockPackegesService.getAgentProducts(this.authService.getCurrentUserId()).subscribe(res=>{
      this.products=res;
     // console.log(this.products);
      this.loadData();
    });
    
    
  }
  inProduct
  interval(el){
    if(el.product_days_or_months=='months'){
      return el.product_days_or_months_numbers+' חודשים';
    }
    if(el.product_days_or_months=='days'){
      return el.product_days_or_months_numbers+' ימים';
    }
  }
  loadExcel(){
    let excel:any=[];
    this.dataSource.getFSData().forEach(el=>{
      let a:any={
        'שם החבילה':el.product_name+' ('+this.interval(el)+')',
        'ספק':el.company_name,
        'מחיר שלך':(el.product_price-(0.01*el.discount*el.product_price)).toFixed(2)+' ש"ח',
        'מחיר מומלץ לצרכן' :el.product_price.toFixed(2)+' ש"ח',
        'תוספת מחיר':this.allow_to_change_price?el.profit.toFixed(2)+' ש"ח':'0',
        'מחיר לצרכן':this.allow_to_change_price?(el.profit+el.product_price).toFixed(2)+' ש"ח':el.product_price.toFixed(2)+' ש"ח',
        'הצג':el.active=='1'?'כן':'לא'
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מחיר חבילות');
  }
  view(row){
    this.loading=true;
    this.productService.view(row).subscribe(res=>{
      this.loading=false;
      this.ngOnInit();
    });
  }
  getCompanyName(row){
    let c=row.company_name;
    if(this.lan!='he'){
      if(this.lan=='ar'){
        if(row.company_name_ar!=''){
          c=row.company_name_ar;
        }
      }
      else{
        if(row.company_name_en!=''){
          c=row.company_name_en;
        }
      }
    }
    return c;
  }
  getProductName(row){
    let c=row.product_name;
    if(this.lan!='he'){
      if(this.lan=='ar'){
        if(row.product_name_ar!=''){
          c=row.product_name_ar;
        }
      }
      else{
        if(row.product_name_en!=''){
          c=row.product_name_en;
        }
      }
    }
    return c;
  }
  getProductDescription(row){
    let c=row.product_description;
    if(this.lan!='he'){
      if(this.lan=='ar'){
        if(row.product_description_ar!=''){
          c=row.product_description_ar;
        }
      }
      else{
        if(row.product_description_en!=''){
          c=row.product_description_en;
        }
      }
    }
    return c;
  }
  loadData(){
    this.loading=true;
    this.productService.getPriceList().subscribe(res=>{
      this.loading=false;
      this.price_list=res.filter(el=>this.products.filter(ll=>ll.id==el.product_id).length>0);
      this.allow_to_change_price=this.price_list[0].agent_change_price=="1";
      this.price_list.forEach(el=>{
        el.all=parseFloat(el.product_price);
        if(this.allow_to_change_price){
          el.all+=parseFloat(el.profit);
        }
      });
      this.initPriceListDatabase();
    });
  }
  displayedColumns = [ 'product_name','company_name','discount','product_price','profit','all','id'];
  priceListDatabase = new DB([]);
  dataSource: DS | null;
  initPriceListDatabase(){
    this.priceListDatabase = new DB(this.price_list);
    this.dataSource = new DS(this.priceListDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  openProfit(row){
    let dialogRef = this.dialog.open(EditProfitComponent, {
      width: '310px',
      data: { data:this,product:row}
    });
    dialogRef.afterClosed().subscribe(result=>{});
  }
}
