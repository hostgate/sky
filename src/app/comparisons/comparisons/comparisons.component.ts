import { Component, OnInit, ViewChild, ElementRef ,Inject,AfterViewInit, Input} from '@angular/core';
import { ComparisonsService } from '../comparisons.service';
import { LocalStorageService } from '../../local-storage.service';
import { MdSort, MdPaginator, MdPaginatorIntl, MdDialogRef, MD_DIALOG_DATA, MdSnackBar, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { Router } from '@angular/router';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-comparisons',
  templateUrl: './comparisons.component.html',
  styleUrls: ['./comparisons.component.css']
})
export class ComparisonsComponent implements OnInit {
  loading:boolean=false;
  excelPhones:any[]=null;
  fromLs:boolean=false;
  in:any=null;
  in2:any=null;
  in3:any=null;
  notIn:any=null;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('paginator') paginator: MdPaginator;
  @ViewChild('filter2') filter2: ElementRef;
  @ViewChild(MdSort) sort2: MdSort;
  @ViewChild('paginator2') paginator2: MdPaginator;
  @ViewChild('filter3') filter3: ElementRef;
  @ViewChild(MdSort) sort3: MdSort;
  @ViewChild('paginator3') paginator3: MdPaginator;
  @ViewChild('fileInput') fileInput;
  @ViewChild('tab') tab: ElementRef;
  selectedTab='phones_statuses';
  constructor(
    private comparisonsService:ComparisonsService,
    private lsService:LocalStorageService,
    private mdPaginatorIntl:MdPaginatorIntl,
    public dialog: MdDialog,
    private excelService:ExcelService,
    public authService:AuthenticationService) {
      localStorage.setItem('currentComponent','app-comparisons');
     }
  ngOnInit() {
   this.fromLs=this.hasCashe();
   this._selectedAll=false;
  }
  changeTab(e){
    let index=e.index;
    if(index==0){
      this.selectedTab='phones_statuses';
    }
    else if(index==1){
      this.selectedTab='active_phones';
    }
    else{
      this.selectedTab='disconnected_phones';
    }
  }
  getStatusName(status){
    switch(status){
      case 'completed':
        return 'פעיל';
      case 'disconnected':
        return 'מנותק';
      case 'without_orders':
        return 'בלי הזמנות';
      case 'cancel':
        return 'מובטל';
      case 'without_member':
        return 'לא שייך למינוי';
      case 'not_exist':
        return 'לא קיים';
    }
  }
  getPhone(el){
    if(el.moved_to_phone && el.moved_to_phone!=0) return el.moved_to_phone; return el.phone;
   }
  loadExcel(){
    let excel:any=[];
    let name='השוואות ';
    let arr:any[];
    if(this.selectedTab=='phones_statuses'){
      name+='סטטוסי טלפונים';
      arr=this.dataSource.getFSData();
    }
    else if(this.selectedTab=='active_phones'){
      name+='מספרים פעילים';
      arr=this.dataSource2.getFSData();
    }
    else{
      name+='מספרים מנותקים';
      arr=this.dataSource3.getFSData();
    }
    arr.forEach(el=>{
      let a:any={
        'טלפון':this.getPhone(el),
        'סטטוס':this.getStatusName(el.status),
        'תאריך ניתוק':el.completed_date
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, name);
  }
  delete_cash(){
    this.lsService.removeStorage('excelPhones');
    this.fromLs=false;
    this.excelPhones=null;
    this.fileInput.nativeElement.value="";
    this.in=[];
    this.in2=[];
    this.in3=[];
    this.toDisconnect=[];
    this.toDisconnectNumbers=[];
    this.initPhoneDatabase();
    this.initPhoneDatabase2();
    this.initPhoneDatabase3();
  }
  hasCashe(){
    if( this.lsService.getStorage('excelPhones')===null){
      this.excelPhones=null;
      this.toDisconnect=[];
      this.toDisconnectNumbers=[];
      return false;
    }
    else{
      this.excelPhones=JSON.parse(this.lsService.getStorage('excelPhones'));
      this.in=this.excelPhones['in'];
      this.in2=this.excelPhones['in'].filter(el=>el.status!='completed' && el.status!='not_exist');
      this.in3=this.excelPhones['in'].filter(el=>el.status=='completed');
      
      this.initPhoneDatabase();
      this.initPhoneDatabase2();
      this.initPhoneDatabase3();
      this.notIn=this.excelPhones['notIn'];
      this.toDisconnect=[];
      this.toDisconnectNumbers=[];
      return true;
    }
  }
  upload() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.loading=true;
      this.comparisonsService.uploadExcel(fileBrowser.files[0]).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.lsService.setStorage('excelPhones',JSON.stringify(r.data),99999999999999);
            this.fromLs=this.hasCashe();
            this.loading=false;
          }
      });
    }
  }
  displayedColumns = [ 'phone','status','completed_date_sec'];
  displayedColumns2 = [ 'phone','status','completed_date_sec'];
  displayedColumns3 = [ 'phone','status','completed_date_sec','id'];
  phonesDatabase = new DB([]);
  dataSource: DS | null;
  phonesDatabase2 = new DB([]);
  dataSource2: DS | null;
  phonesDatabase3 = new DB([]);
  dataSource3: DS | null;
  initPhoneDatabase(){
    this.phonesDatabase = new DB(this.in);
    this.dataSource = new DS(this.phonesDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
  initPhoneDatabase2(){
    this.phonesDatabase2 = new DB(this.in2);
    this.dataSource2 = new DS(this.phonesDatabase2, this.sort2, this.paginator2);
    Observable.fromEvent(this.filter2.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource2) { return; }
      this.dataSource2.filter = this.filter2.nativeElement.value;
    });
  }
  initPhoneDatabase3(){
    this.phonesDatabase3 = new DB(this.in3);
    this.dataSource3 = new DS(this.phonesDatabase3, this.sort3, this.paginator3);
    Observable.fromEvent(this.filter3.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource3) { return; }
      this.dataSource3.filter = this.filter3.nativeElement.value;
    });
  }
  _selectedAll:boolean=true;
  selectedAll(){
      this.in3.forEach(element => {
        if(this._selectedAll){
          element.to_disconnect=true;
        }
        else{
          element.to_disconnect=false;
        }
      });
      this._selectedAll=!this._selectedAll;
      this.chooseSelected();
  }
  check(){
    this.chooseSelected();
  }
  toDisconnect:any[];
  toDisconnectNumbers:any[];
  chooseSelected(){
    this.toDisconnect=[];
    this.toDisconnectNumbers=[];
    this.in3.forEach(el=>{
        if(el.to_disconnect){
         this.toDisconnect.push(el.order_id);
         this.toDisconnectNumbers.push(el.phone);
        }
    });
  } 
  disconnect_lines(){
    this.comparisonsService.disconnect_orders(this.toDisconnect).subscribe(res=>{
      if(res && res['_body']){
        let r=JSON.parse(res['_body']);
        this.loading=false;
        this.excelPhones['in'].forEach(el=>{
          if(this.toDisconnect.indexOf(parseInt(el.order_id)) > -1){
            el.status=r.status;
            el.disconnect_date_sec=r.disconnect_date_sec;
            el.disconnect_date=r.disconnect_date; 
          }
        });
        this.lsService.setStorage('excelPhones',JSON.stringify({in:this.excelPhones['in'],notIn:this.excelPhones['notIn']}),99999999999999);
            this.fromLs=this.hasCashe();
            this.toDisconnect=[];
            this.toDisconnectNumbers=[];
      }
    });
  }
  openDisconnectDialog(): void {
    let dialogRef=this.dialog.open(DisconnectDialog, {
      width:'310px',
      data:{data:this}
    });
    dialogRef.afterClosed().subscribe();
  }
}
@Component({
  selector: 'disconnect-dialog',
  templateUrl: 'disconnect-dialog.html',
})
export class DisconnectDialog {
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<DisconnectDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    public snackBar: MdSnackBar,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private router:Router,
    private authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  disconnect(todelete:string){
    this.data.data.loading=true;
    this.data.data.disconnect_lines();
    this.snackBar.open('הצלחה', todelete, {
      duration: 2000,
    });
  }
}