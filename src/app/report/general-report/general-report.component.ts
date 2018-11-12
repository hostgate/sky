import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../order/order.service';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { MdSort, MdPaginator, MdDialog } from '@angular/material';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { RefreshConnectComponent } from '../refresh-connect/refresh-connect.component';
import { AddRestComponent } from '../../payment/add-rest/add-rest.component';
import { DisconnectMemberComponent } from '../disconnect-member/disconnect-member.component';
@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.css']
})
export class GeneralReportComponent implements OnInit {
  orders:any[]=null;alls:any[]=null;loading:Boolean=false;db=new DB([]);ds:DS|null;lan:any;filter_by_date:Boolean=false;
  sum_price:any=0.0;sum_price_agent:any=0.0;sum_profit:any=0.0;all_rows:Boolean=false; page=1;limit=100;totalCount=0;
  sum_rest:any=0.0;
  pages=[];__trans:Boolean=false;_begin=null;_end=null;
  displayedColumns=['last_update_sec','phone','agent_name','product_name','status','price','price_agent','rest','profit','id'];
  @ViewChild('filter') filter: ElementRef;
  @ViewChild('filter1') filter1: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  constructor(
      private orderService:OrderService,
      private trans:TranslateService,
      private lsService:LocalStorageService,
      private excelService:ExcelService,
      public authService:AuthenticationService,
      public dialog: MdDialog
    ) { 
        this.lan=this.lsService.getStorage('lan');
        this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
          this.lan=event.lang;
        });
        localStorage.setItem('currentComponent','app-general-report');
  }
  refreshConnect(row){
    let dialogRef=this.dialog.open(RefreshConnectComponent,{
      width:'310px', 
      data:{row:row,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  disconnectMember(row){
    let dialogRef=this.dialog.open(DisconnectMemberComponent,{
      width:'310px', 
      data:{row:row,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  addRest(row){
    let dialogRef=this.dialog.open(AddRestComponent,{
      width:'310px', 
      data:{row:row,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  transStatus(status){
    switch(status){
      case 'new':return 'חדש';
      case 'declined':return 'נדחה';
      case 'cancel':return 'מובטל';
      case 'completed':return 'פעיל';
      case 'disconnected':return 'מנותק';
      case 'finished':return 'פג תוקף';
      case '':return 'הכל';
    }
  }
  getProductName(product){
    let c=product.product_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
      if(product.product_name_ar!='')c=product.product_name_ar;
    }
    else{
      if(product.product_name_en!='')c=product.product_name_en;
    }
    return c;
  }
  getCompanyName(company){
    let c=company.company_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
      if(company.company_name_ar!='')c=company.company_name_ar;
    }
    else{
      if(company.company_name_en!='')c=company.company_name_en;
    }
    return c;
  }
  getPhone(el){
    if(el.moved_to_phone && el.moved_to_phone!=0)return el.moved_to_phone;
    return el.phone;
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
        'פעיל עד':el.status==='completed'?('עד :'+el.completed_date):'לא פעיל',
        'מחיר מומלץ':el.price,
        'עלות':el.price_agent,
        'החזר':el.rest,
        'נמכר ללקוח':parseFloat(el.price)+parseFloat(el.profit)
      }
      if(this.__trans)a['טלפון זמני']=el.phone;
      excel.push(a);
    });
    let name=this.transStatus(this.filter1.nativeElement.value);
    this.excelService.exportAsExcelFile(excel, 'דו"ח כללי'+'('+name+')');
  }
  ngOnInit() {this.loadOrders();}
  updateSum(){
    this.sum_price=0.0;
    this.sum_price_agent=0.0;
    this.sum_rest=0.0;
    this.sum_profit=0.0;
    this.ds.getFSData().forEach(el=>{
      this.sum_price+=parseFloat(el.price);
      this.sum_price_agent+=parseFloat(el.price_agent);
      this.sum_rest+=parseFloat(el.rest);
      this.sum_profit+=parseFloat(el.profit)+parseFloat(el.price);
    });
  }
  all_rows_false(){this.all_rows=false;}
  all_rows_true(){this.all_rows=true;}
  loadOrders(){
    this.loading=true;
    this.orderService.getOrdersReport(this.all_rows?1:0,this.page,this.limit).subscribe(res => {
      this.loading=false;
        if(res && !res['message']){
          this.alls=res.items;
          this.totalCount=parseInt(res.totalCount);
          this.setPages();
          if(this.authService.isAgent())this.orders=this.alls.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
          else this.orders=this.alls;
          this.initOrderDatabase();
        }
     }); 
  }
  setPages(){
    this.pages=[];let i=1,total=this.totalCount;
    while(total>0){this.pages.push(i);total-=this.limit;i++;}
  }
  initOrderDatabase(){
    this.db = new DB(this.orders);
    this.ds = new DS(this.db, this.sort, this.paginator);
    this.ds.filter=this.filter.nativeElement.value;
    this.updateSum();
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.ds)return; 
      this.ds.filter = this.filter.nativeElement.value;
      this.updateSum();
    });
  }
  changeStatus(status){
    this.__trans=false;
    this.filter1.nativeElement.value=status;
    this.orders=this.alls;
    if(this.authService.isAgent())this.orders=this.orders.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
    if(this._begin!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)>=Date.parse(this._begin)*0.001);
    if(this._end!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)<(86400+Date.parse(this._end)*0.001));
    if(status!='')this.orders=this.orders.filter(el=>el.status==status);
    this.initOrderDatabase();
  }
  _trans(status){
    this.__trans=true;
    this.filter1.nativeElement.value=status;
    this.orders=this.alls;
    if(this.authService.isAgent())this.orders=this.orders.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
    if(this._begin!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)>=Date.parse(this._begin)*0.001);
    if(this._end!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)<(86400+Date.parse(this._end)*0.001));
    this.orders=this.orders.filter(el=>el.moved_to_phone!='0');
    let _orders:any=[];
    this.orders.reverse().forEach(el=>{
      if(_orders.filter(e=>e.member_id==el.member_id)==0)_orders.push(el);
    });
    this.orders=_orders.reverse();
    this.initOrderDatabase();
  }
  resetDates(){this._begin=null;this._end=null;}
  setDates(){
    this.orders=this.alls;
    if(this.authService.isAgent())this.orders=this.orders.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId())); 
    if(this._begin!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)>=Date.parse(this._begin)*0.001);
    if(this._end!=null)this.orders=this.orders.filter(el=> parseInt(el.created_at_sec)<(86400+Date.parse(this._end)*0.001));
    if(this.filter1.nativeElement.value && this.filter1.nativeElement.value!=''){
      let status=this.filter1.nativeElement.value;
      this.orders=this.orders.filter(el=>el.status==status); 
    }
    this.initOrderDatabase();
  }
}
