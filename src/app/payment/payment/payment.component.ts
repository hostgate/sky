import { Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { PaymentService } from '../payment.service';
import { Payment } from '../../model/payment';
import { MdDialog, MdPaginatorIntl, MdSort, MdPaginator } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DeleteComponent } from '../delete/delete.component';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { AddComponent } from '../add/add.component';
import { LangChangeEvent, TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { Router } from '@angular/router';
import { ObligationService } from '../../users/obligation.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  payments:Payment[]=null;
  @Input() loading:Boolean=false;
  item:Payment;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  lan:any;
  constructor(
    private paymentService:PaymentService,
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    private obligationService:ObligationService,

    private router:Router,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-payment');
    }
    getPaymentArt(art){
      switch(art){
        case 'rest': return 'החזר';
        case 'shek': return 'שיק';
        case 'promotional': return 'זיכוי';
        case 'cash': return 'מזומן';
        case 'bank_transfer': return 'העברה בנקאית';
        case 'standing_order': return 'הוראת קבע';
      }
    }
    toDateTime(secs) {
        var t = new Date(1970, 0, 1); // Epoch
        t.setSeconds(secs);
        return t;
    }
    obligation:any;
    loadObligationAgent(id){
      this.obligationService.getObligation(id).subscribe(obligation=>{
        this.loading=false;
        this.obligation=obligation;
        if(!this.obligation.credit)this.obligation.credit=0.0;
        let c=
        this.obligation.can_use=parseFloat(this.obligation.credit)+parseFloat(this.obligation.obligation);
        if(this.obligation.can_use<0){
          this.obligation.can_use=0;
        }
      });
    }
    loadExcel(){
      let excel:any=[];
      this.ds.getFSData().forEach(el=>{
        let a:any={
          'id':el.id,
          'סוכן':el.agent_name,
          'הוסף על ידי':el.add_by_name,
          'סכום':el.amount,
          'קשור לתאריך':el.related_to_date2,
          'סוג תשלום' :this.getPaymentArt(el.art),
          'חשבון לפני':el.account_before,
          'טלפון':el.phone,
          'הערה':el.note
  
        }
        excel.push(a);
      });
      this.excelService.exportAsExcelFile(excel, 'תשלומים');
    }
  ngOnInit() {
    this.loadPayments();
    if(this.authService.isAgent()){
      this.loadObligationAgent(this.authService.getCurrentUserId());
    }
  }
  loadPayments(){
    this.paymentService.getPayments().subscribe(res=>{
      if(!res['message']){
        this.payments=res;
        this.initPaymentDatabase();
      }
    });
  }
  addPayment(payment:Payment){
    this.loading=true;
    this.paymentService.add([payment]).subscribe(res => {
      this.loading=false;
      this.ngOnInit();
    });
  }
 editPayment(payment:Payment){
    this.loading=true;
    this.paymentService.update(payment).subscribe(res => {
      this.loading=false;
      this.ngOnInit();
    });
  }
  delete(id:number){
    let dialogRef=this.dialog.open(DeleteComponent,{
      width:'310px',
      data:{id:id,payment:this.payments.filter(payment=> payment.id==id)[0],data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPayments();
    });
  }
  openAddDialog(): void {
    let dialogRef=this.dialog.open(AddComponent, {
      width:'310px',
      data:{payment:this,edit:false}
    });
    dialogRef.afterClosed().subscribe();
  }
  openEditDialog(payment:Payment): void {
    let dialogRef=this.dialog.open(AddComponent, {
      width:'310px',
      data:{payment:this,edit:true,value:payment}
    });
    dialogRef.afterClosed().subscribe();
  }
  displayedColumns = [ 'agent_name','add_by_name','amount','related_to_date','account_before','art','phone','note','id'];
  
  db = new DB([]);
  ds: DS | null;
  initPaymentDatabase(){
    //if(this.authService.isAdmin()){
     // this.displayedColumns.push('id');
    //}
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
}

