import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import * as moment from 'moment/moment';
import { AuthenticationService } from '../../login/authentication.service';
import { MdSort, MdPaginator } from '@angular/material';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-agent-payments',
  templateUrl: './agent-payments.component.html',
  styleUrls: ['./agent-payments.component.css']
})
export class AgentPaymentsComponent implements OnInit {
  lan:any;
  constructor(private trans:TranslateService, 
              private lsService:LocalStorageService,
              private excelService:ExcelService,
              public authService:AuthenticationService) {
   
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-agent-payments');
   }
  @Input() agent:any;
  @Input()
  public openPaymentAdd: Function; 
  public payments:any[];
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  displayedColumns = [ 'id','amount','account_before','related_to_date_sec','payment_art'];
  db = new DB([]);
  ds: DS | null;
  initPaymentsDatabase(){
    
    this.db = new DB(this.payments);
    this.ds = new DS(this.db, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.ds) { return; }
      this.ds.filter = this.filter.nativeElement.value;
    });
  }
  ngOnInit() {
    this.payments=this.agent.payments;
    this.initPaymentsDatabase();
  }
  getPaymentArt(art){
    switch(art){
      case 'rest': return 'החזר';
      case 'shek': return 'שיק';
      case 'credit': return 'אשראי';
      case 'cash': return 'מזומן';
    }
  }
  loadExcel(){
    let excel:any=[];
    this.ds.getFSData().forEach(el=>{
      let a:any={
        'id':el.id,
        'סכום':el.amount+ '₪',
        'קשור לתאריך':moment(el.related_to_date).format('DD.MM.YYYY'),
        'סוג תשלום':this.getPaymentArt(el.art)
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'תשלומים עבור '+ this.agent.username);
  }
}
