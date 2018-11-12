import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl } from '@angular/material';
import { ValidationService } from '../../validation.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { AgentsCreditsService } from '../agents-credits.service';

@Component({
  selector: 'app-agents-credits',
  templateUrl: './agents-credits.component.html',
  styleUrls: ['./agents-credits.component.css']
})
export class AgentsCreditsComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  credits:any[]=null;
  public loading:Boolean=true;
  constructor(private agentsCreditsService:AgentsCreditsService,
    private validationService:ValidationService,
    public dialog: MdDialog,
    private router:Router,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService) { }
 
  ngOnInit() {
    this.loadCredits();
  }
  displayedColumns = ['name', 'credit','obligation','can_use','total_payments','total_orders'];
  creditsDatabase = new DB([]);
  dataSource: DS | null;
  initBlocksDatabase(){
    this.creditsDatabase = new DB(this.credits);
    this.dataSource = new DS(this.creditsDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  loadCredits(){
    this.loading=true;
    this.agentsCreditsService.get().subscribe(res=>{
      this.loading=false;
      this.credits=res;
      this.credits.forEach(el => {
        el.credit=this.rr(el.credit);
        el.obligation=this.rr(el.obligation);
        el.can_use=this.rr(el.can_use);
        el.total_orders=this.rr(el.total_orders);
        el.total_payments=this.rr(el.total_payments);
      });
      this. initBlocksDatabase()
    });
  }
  stripslashes(str) {
    if(!str || str=='' || str==null) return '';
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    str = str.replace(/\\'/g, '\'');
    str = str.replace(/\\"/g, '"');
    str = str.replace(/\\0/g, '\0');
    str = str.replace(/\\\\/g, '\\');
    return str;
}
  loadExcel(){
    let excel:any=[];
    this.dataSource.getFSData().forEach(el=>{
      let a:any={
        'סוכן':this.stripslashes(el.name),
        'יתרה בחשבון' :el.credit,
        'מסגרת אשראי' :el.obligation,
        'יתרת ניצול'  :el.can_use,
        'סה"כ הזמנות' :el.total_orders,
        'סה"כ תשלומים':el.total_payments
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'חשבונות סוכנים');
  }
  rr(x){
    return (x>-1 && x<1)?0:x;
  }
}
