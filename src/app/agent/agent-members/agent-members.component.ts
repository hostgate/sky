import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MdSort, MdPaginator } from '@angular/material';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { ExcelService } from '../../excel.service';
@Component({
  selector: 'app-agent-members',
  templateUrl: './agent-members.component.html',
  styleUrls: ['./agent-members.component.css']
})
export class AgentMembersComponent implements OnInit {
  @Input() agent:any;
  lan:any;
  public members:any[]=[];
  @ViewChild('filter1') filter1:ElementRef;
  @ViewChild(MdSort) sort1:MdSort;
  @ViewChild('paginator1') paginator1:MdPaginator;
  displayedColumns=[ 'id','consumer_name','phone','has_orders','status','order_id'];
  db=new DB([]);
  ds:DS|null;
  initMembersDatabase(){
    this.db = new DB(this.members);
    this.ds = new DS(this.db, this.sort1, this.paginator1);
    Observable.fromEvent(this.filter1.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(()=>{
      if (!this.ds){return;}
      this.ds.filter=this.filter1.nativeElement.value;
    });
  }
  constructor(private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private excelService:ExcelService){
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent)=>{
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-agent-members');
  }
  ngOnInit(){
    if(this.agent && this.agent.members && this.agent.members.length>0){
      this.agent.members.forEach(el=>{
        let member:any={
          'id':el.id,
          'consumer_name':el.consumer_name,
          'accepted_moved_to_phone':el.accepted_moved_to_phone,
          'phone_id':el.phone_id,
          'company_id':el.company_id,
          'product_id':'',
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
          member.company_id=el.orders[0].company_id;
          member.company_name_ar=el.orders[0].company_name_ar;
          member.product_id=el.orders[0].product_id;
          member.company_name_en=el.orders[0].company_name_en;
          member.product_name=el.orders[0].product_name;
          member.product_name_ar=el.orders[0].product_name_ar;
          member.product_name_en=el.orders[0].product_name_en;
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
  getCompanyName(row){
    if(this.lan=='he') {
      return row.company_name;
    }
    else if(this.lan=='ar'){
      if(row.company_name_ar!=''){
        return row.company_name_ar;
      }
    }
    else{
      if(row.company_name_en!=''){
        return row.company_name_en;
      }
    }
    return row.company_name;
  }
  getProductName(row){
    if(this.lan=='he') {
      return row.product_name;
    }
    else if(this.lan=='ar'){
      if(row.product_name_ar!=''){
        return row.product_name_ar;
      }
    }
    else{
      if(row.product_name_en!=''){
        return row.product_name_en;
      }
    }
    return row.product_name;
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
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים -'+ this.agent.username);
  }
}
