import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../../model/order';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl, MdSnackBar } from '@angular/material';
import { AddComponent } from '../add/add.component';
import { DeleteComponent } from '../delete/delete.component';
import { CompleteComponent } from '../complete/complete.component';
import { DeclineComponent } from '../decline/decline.component';
import { CancelComponent } from '../cancel/cancel.component';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import * as moment from 'moment/moment';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders:Order[]=null;
  loading:Boolean=false;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  lan:any;
  constructor(
    private orderService:OrderService,
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    public snackBar: MdSnackBar,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService
  ) {
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-order');
   }
   transStatus(status){
     switch(status){
       case 'new':
        return 'חדש';
        case 'declined':
        return 'נדחה';
        case 'cancel':
        return 'מובטל';
        case 'completed':
        return 'פעיל';
        case 'disconnected':
        return 'מנותק';
        case 'finished':
        return 'פג תוקף';
     }
   }
   getProductName(product){
    let c=product.product_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
     if(product.product_name_ar!=''){
       c=product.product_name_ar;
     }
    }
    else{
     if(product.product_name_en!=''){
       c=product.product_name_en;
     }
    }
    return c;
  }
  getCompanyName(company){
    let c=company.company_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
     if(company.company_name_ar!=''){
       c=company.company_name_ar;
     }
    }
    else{
     if(company.company_name_en!=''){
       c=company.company_name_en;
     }
    }
    return c;
  }
  getPhone(el){
    if(el.moved_to_phone && el.moved_to_phone!=0) return el.moved_to_phone; return el.phone;
   }
   loadExcel(){
     let excel:any=[];
     this.ds.getFSData().forEach(el=>{
       let a:any={
         'id':el.id,
         'עדכון אחרון':el.last_update,
         'טלפון':this.getPhone(el),
         'סוכן':el.agent_name,
         'סים':el.sim,
         'חברה':el.company_name,
         'חבילה':el.product_name,
         'סטטוס':this.transStatus(el.status) ,
         'פעיל עד':el.status==='completed'?('עד :'+el.completed_date):'לא פעיל'
       }
       excel.push(a);
     });
     this.excelService.exportAsExcelFile(excel, 'הזמנות');
   }
  ngOnInit() {
    this.newOrder();
    this.loadOrders();
  }
  newOrder(){
    let o:Order=new Order();
    o.member_id=12;
    o.agent_id=3;
    o.status=0;
    o.product_id=12;
  }
  loadOrders(){
    this.orderService.getOrders().subscribe(res => {
        if(res && !res['message']){
          this.orders=res; 
          if(this.authService.isAgent()){
            this.orders=this.orders.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
          }
          this.initOrderDatabase();
        }
     }); 
  }
  allow_release(order){
    if( String(order.status)=='cancel' && this.orders.filter(el=>el.phone_id==order.phone_id).length==1){
     return true;
    }
    return false;
  }
  releaseMember(order){
    this.orderService.release_member(order).subscribe(res=>{
      this.loadOrders();
    });
  }
  add(){
    let dialogRef=this.dialog.open(AddComponent,{
      width:'310px',
      data:{order:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadOrders();
    });
  }
  // delete(id:number){
  //   let dialogRef=this.dialog.open(DeleteComponent,{
  //     width:'310px',
  //     data:{id:id,order:this.orders.filter(order=> order.id==id)[0]}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.loadOrders();
  //   });
  // }
  complete(order:Order){
    let dialogRef=this.dialog.open(CompleteComponent,{
      width:'310px',
      data:{id:order.id,order:order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadOrders();
    });
  }
  decline(order:Order){
    let dialogRef=this.dialog.open(DeclineComponent,{
      width:'310px',
      data:{id:order.id,order:order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadOrders();
      
    });
  }
  cancel(order:Order){
    let dialogRef=this.dialog.open(CancelComponent,{
      width:'310px',
      data:{id:order.id,order:order,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadOrders();
      
    });
  }
  displayedColumns=['last_update_sec','phone','agent_name','product_name','company_name','status','id','automatic_update'];
  db = new DB([]);
  ds: DS | null;
  initOrderDatabase(){
    this.db = new DB(this.orders);
    this.ds = new DS(this.db, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.ds) { return; }
      this.ds.filter = this.filter.nativeElement.value;
    });
  }
  setAutomaticUpdate(row,e){
    
    let mes='הזמנה זו תתחדש חודשי!!';
    if(!e.checked){
      mes='ביטול חידוש חודשי להזמנה';
    }
    this.orderService.set_automatic_update(row.id,row.months).subscribe(res=>{
      this.snackBar.open(mes, row.phone , {
        duration: 5000,
      });
      this.ngOnInit();
    });
  }
}
