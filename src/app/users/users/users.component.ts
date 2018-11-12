import { Component, OnInit, ViewContainerRef, ViewChild, ElementRef, Inject } from '@angular/core';
import { User } from "../../model/user";
import { UsersService } from "../users.service";
import { FormControl, Validators, NgModel, FormGroup,FormBuilder} from "@angular/forms";
import { ServerDateTime } from "../../model/server_date_time";
import { ValidationService } from "../../validation.service";
import { Router } from '@angular/router';
import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl, MdDialogRef, MD_DIALOG_DATA ,MdSnackBar} from '@angular/material';

import { YnPipe } from '../../pipes/yn.pipe';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [/*ServerDateTimeService*/ValidationService]
})
export class UsersComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  users:User[];
  public dt:ServerDateTime[];
  item: User;
  name: string;
  private sTimeout;
  editRowId:number=0;
  toggleEdit(id){
    this.editRowId = id;
  }
  public loading:Boolean=true;
  searchForm: FormGroup;
  private setForm() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }
  timeout() { 
    setTimeout(() => {
      this.timeout();
    }, 1000);
  }
   timeoutMSG() { 
    setTimeout(() => {
      this.clear();
    }, 7000);
  } 
  lan:any;
  constructor(
    private userService:UsersService,
    private mdPaginatorIntl:MdPaginatorIntl,
    private formBuilder: FormBuilder,
    private validationService:ValidationService,
    private router:Router,public dialog: MdDialog ,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private excelService:ExcelService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      this.users = new Array<User>();
      this.timeout(); 
      this.timeoutMSG(); 
      localStorage.setItem('currentComponent','app-users');
    }
    getUserArt(level_id){
      switch(level_id){
        case '1': return 'מנהל';
        case '2': return 'סוכן';
        case '3': return 'עובד';
      }
    }
    loadExcel(){
      let excel:any=[];
      //'username', 'product_name','discount' ,'user_id'
      this.dataSource.getFSData().forEach(el=>{
        let a:any={
          'id':el.id,
          'שם משתמש':el.username,
          'סוג משתמש':this.getUserArt(el.level_id),
          'שם פרטי':el.firstname,
          'שם משפחה':el.lastname,
          'תעודת זהות':el.national_id,
          //'תאריך לידה':el.birhday,
          'דואר אלקטרוני':el.email,
          'טלפון נייד':el.mobile,
          'טלפון':el.phone,
          'משתמש מתאריך':el.created_at,
          'סוג תשלום':el.level_id!=3?'':el.payment_art=='others'?'אחר':el.payment_art=='direct_debit'?'הוראת קבע':'כרטיס אשראי'
        }
        excel.push(a);
      });
      this.excelService.exportAsExcelFile(excel, 'משתמשים');
    }
  onChangeEvent({target}){
    this.name = target.value;
  }
  // greetMe(id:number){
  //   let username=this.users.filter(item => item['id']==id)[0].username;
  //   this.confirmationService.confirm({
  //   message: `למחוק משתמש ${username} `,
  //   header: 'מחיקה!!',
  //   icon: 'fa fa-question-circle',
  //   accept: () => {
  //     this.delete(id);
  //   },
  //   reject: () => {}
  //   });
  // }
  getLastId(){
    if(this.users.length==0) return 0;
    return this.users[this.users.length-1].id;
  }
  refresh(): void {
      this.editRowId=0;
      this.loadData();
  }
  ngOnInit() {
    this.editRowId=0;
    this.setForm();
    this.loadData();
  }
  loadData() {
    this.userService.getUsers().subscribe(res => {
       this.loading=false;
        if(!res['message']) {
        this.users = res.reverse();
        this.initUserDatabase();
        }
      });
  }
  loadSearchData(search) {
    this.userService.getSearch(search).subscribe(res => {
        this.loading=false;
        if(!res['message']) {
          this.users = res.reverse();
        }
        else{
          this.users=[];
        }
      });
  }
  clear() {
  }
  search(){
    let search:string=this.searchForm.value.search;
    if(search!=''){
      this.loadSearchData(search);
    }
    else{
      this.loadData();
    }
  }
  displayedColumns = ['username','level_id','mobile','id'];
  usersDatabase = new DB([]);
  dataSource: DS | null;
  initUserDatabase(){
    this.usersDatabase = new DB(this.users);
    this.dataSource = new DS(this.usersDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
   
  }
  delete(id:number){
    let dialogRef=this.dialog.open(DeleteDialog,{
      width:'310px',
      data:{ id: id,username:this.users.filter(user=> user.id==id)[0].username,data:this }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  providers: [YnPipe],
})
export class DeleteDialog {
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<DeleteDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private userService:UsersService,
    public snackBar: MdSnackBar,private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  delete(id:number,todelete:string){
    this.data.loading=true;
    this.userService.delete(id).subscribe(res=>{
      this.snackBar.open(this.data.username, todelete, {
        duration: 2000,
      });
      this.data.loading=false;
    });
  }
}