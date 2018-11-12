import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MdSort, MdPaginator } from '@angular/material';
import { DS } from '../../datasource/ds';
import { DB } from '../../database/db';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-customer-members',
  templateUrl: './customer-members.component.html',
  styleUrls: ['./customer-members.component.css']
})
export class CustomerMembersComponent implements OnInit {

  constructor(private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService) {
     this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-customer-members');
  }
  @Input() customer:any;
  lan:any;
  public members:any[]=[];
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('paginator') paginator: MdPaginator;
  displayedColumns = [ 'id','consumer_name','phone','has_orders','status','order_id'];
  db = new DB([]);
  ds: DS | null;
  initMembersDatabase(){
    
    this.db = new DB(this.members);
   
    this.ds = new DS(this.db, this.sort, this.paginator);
   // console.log(this.ds);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.ds) { return; }
      this.ds.filter = this.filter.nativeElement.value;
    });
  }
  ngOnInit() {
    if(this.customer && this.customer.members && this.customer.members.length>0){
      this.customer.members.forEach(el=>{
        //console.log(el);
        let member:any={
          'id':el.id,
          'consumer_name':el.consumer_name,
          'accepted_moved_to_phone':el.accepted_moved_to_phone,
          'phone_id':el.phone_id,
          'phone':el.phone,
          'moved_to_phone':el.moved_to_phone,
          'has_orders':(el.orders && el.orders.length>0)?true:false,
          'company_name':'',
          'product_name':'',
          'product_name_ar':'',
          'status':'',
          'completed_date_sec':'',
          'completed_date':'',
          'order_id':'',
        };
        if(member.has_orders){
          member.company_name=el.orders[0].company_name;
          member.product_name=el.orders[0].product_name;
          member.product_name_ar=el.orders[0].product_name_ar;
          member.status=el.orders[0].status;
          member.completed_date_sec=el.orders[0].completed_date_sec;
          member.completed_date=el.orders[0].completed_date;
          member.order_id=el.orders[0].id;
        }
        this.members.push(member);
      });
      this.initMembersDatabase();
    }
  }
  searchMembers(members,val){
    if(val==''){
      return members;
    }else{
      return members.filter(
        member => member.phone.indexOf(val)>=0);
    }
    
  }
  transStatus(el){
    switch(el.status){
      case 'new':
       return 'חדש';
       case 'declined':
       return 'נדחה';
       case 'cancel':
       return 'מובטל';
       case 'completed':
       return 'פעיל'+ '  עד'+ ' '+ el.completed_date;
       case 'disconnected':
       return 'מנותק';
       case 'finished':
       return 'פג תוקף';
    }
  }
  getPhone(el){
    if(el.moved_to_phone=='0' && el.accepted_moved_to_phone=='0'){
      return el.phone;
    }
    if(el.moved_to_phone!='0' && el.accepted_moved_to_phone=='1'){
      return el.phone+' >> '+el.moved_to_phone;
    }
    if(el.moved_to_phone!='0' && el.accepted_moved_to_phone=='0'){
      return el.phone+' >> '+el.moved_to_phone;
    }
  }
  loadExcelMembers(members,val){ 
    let excel:any=[];
    this.searchMembers(members,val).forEach(el=>{
      let a:any={
        'id':el.id,
        'לקוח':el.consumer_name,
        'טלפון':this.getPhone(el),
        'חבילה':el.orders?el.orders[0].company_name+'/'+el.orders[0].product_name:'אין הזמנות',
        'סטטוס':el.orders?this.transStatus(el.orders[0].status):'אין הזמנות',
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים');
  }
  consumer_name:'';
  loadExcel(){
    let excel:any=[];
    this.ds.getFSData().forEach(el=>{
      let a:any={
        'לקוח':el.consumer_name,
        'טלפון':el.phone,
        'חבילה':el.product_name,
        'סטטוס':this.transStatus(el),
        'מספר הזמנה':!el.has_orders?'עדיין אין הזמנות':el.id
      }
      this.consumer_name=el.consumer_name;
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים -'+ this.consumer_name);
  }
}
