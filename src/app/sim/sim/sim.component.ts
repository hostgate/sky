import { Component, OnInit, ViewChild, ElementRef ,Inject,AfterViewInit, Input} from '@angular/core';
import { SimService } from '../sim.service';
import { UsersService } from '../../users/users.service';
import { Sim } from '../../model/sim';
import { ValidationService } from '../../validation.service';
import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl, MdDialogRef, MD_DIALOG_DATA ,MdSnackBar, MatSnackBar} from '@angular/material';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { Observable } from 'rxjs/Observable';
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { AddSimComponent } from '../add-sim/add-sim.component';
import { EditSimComponent } from '../edit-sim/edit-sim.component';
import { CompanyService } from '../../company/company.service';
import { Company } from '../../model/company';
import * as AppConst from '../../app.const';
import { YnPipe } from '../../pipes/yn.pipe';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MsgComponent } from '../../msg/msg.component';
import {merge} from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
@Component({
  selector: 'app-sim',
  templateUrl: './sim.component.html',
  styleUrls: ['./sim.component.css'],
  providers: [ValidationService],
})
export class SimComponent implements OnInit {
  excelSims:any[]=null;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  total_pages=0;
  current_total=0;
  pageIndex=0;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  lan:any;
  constructor(private simService:SimService,
              private companyService:CompanyService,
              private usersService:UsersService,
              private validationService:ValidationService,
              private formBuilder:FormBuilder,
              public dialog: MdDialog,
              private mdPaginatorIntl:MdPaginatorIntl,private trans:TranslateService,
              private lsService:LocalStorageService,
              private excelService:ExcelService,
              public authService:AuthenticationService,
              public snackBar: MatSnackBar) {
                this.lan=this.lsService.getStorage('lan');
                this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
                  this.lan=event.lang;
                });
                localStorage.setItem('currentComponent','app-sim');
              }
  loadExcel(){
    let excel:any=[];
    this.dataSource.getFSData().forEach(el=>{
      let a:any={
        'id':el.id,
        'סים':el.sim,
        'סוכן':el.agent_name,
        'חברה':this.companies.filter(ele=>ele.id==el.company_id)[0].name,
        'בשימוש':el.used==='1'?'כן':'לא'
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מלאי סימים');
  }
  loadExcel2(){
    this.loading=true;
   this.simService.getExcel(this.filter.nativeElement.value).subscribe(res=>{
      this.loading=false;
      let excel:any=[];
      res.items.forEach(el=>{
      let a:any={
        'id':el.id,
        'סים':el.sim,
        'סוכן':el.agent_name,
        'חברה':this.companies.filter(ele=>ele.id==el.company_id)[0].name,
        'בשימוש':el.used==='1'?'כן':'לא'
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מלאי סימים');
   })
  }
  sims:Sim[];
  companies:Company[];
  loading:Boolean=true;
  item:Sim;
  simForm:FormGroup;
  formOnInit(sim:any){
    let fb:any={
      'sim':sim.sim?[sim.sim, Validators.required]:['', Validators.required],
      'note':sim.note?[sim.note]:[''],
      'agent_id':sim.agent_id?[sim.agent_id, Validators.required]:[null, Validators.required],
      'company_id':sim.company_id?[sim.company_id, Validators.required]:[null, Validators.required]
    };
    if(this.excelSims!=null){
      fb.sim=['1', Validators.required];
    }
    this.simForm = this.formBuilder.group(fb);
  }
  private setSimForm(row:any=0) { 
     if(row && row.id>0){
             this.formOnInit(row);  
     }
     else{
      this.formOnInit({});
     }
   }
  public restSimForm(){
    this.item = {
      id: null,
      sim: '',
      note:'',
      created_at: '',
      created_at_sec: '',
      last_update: '',
      last_update_sec: '',
      agent_id: 0,
      agent_name:'',
      used:false,
      company_id:null,
      company_name:'',
      company_name_ar:'',
      company_name_en:''
    };
    this.formOnInit(this.item );
  }
  clear(){
    //this.msgs = [];
  }
  
  delete(id:number){
    let dialogRef=this.dialog.open(DeleteDialog,{
      width:'310px',
      data:{ id: id,sim:this.sims.filter(sim=> sim.id==id)[0].sim,data:this }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  loadCompanies(){
    this.companyService.getCompanys().subscribe(res=>{
        if(!res['message']){
          this.companies=res;
        }
    });
  }
  
  ngOnInit() {
   this.sort.sortChange.subscribe(() =>{ this.paginator.pageIndex = 0;
    this.pageIndex=0;
  });
  Observable.fromEvent(this.filter.nativeElement,'keyup').subscribe(() =>{ this.paginator.pageIndex = 0;
    this.pageIndex=0;
  });
  
    merge(this.sort.sortChange, this.paginator.page,Observable.fromEvent(this.filter.nativeElement,'keyup'))
        .startWith({})
        .debounceTime(150)
        .distinctUntilChanged()
        .switchMap(() => {
          let active=this.sort.active?this.sort.active:'id';
          let direction=this.sort.direction?this.sort.direction:'asc';
          this.pageIndex=this.pageIndex+1
          let search=this.filter.nativeElement.value;
          this.loading = true;
          return this.simService!.get(active, direction, this.pageIndex,search);
        }).
        map(data => {this.init_data(data);})
      .subscribe(data =>  {
    });
    this.loadCompanies();
    this.setSimForm();
  }
  init_data(data){
    this.loading = false;
    this.isRateLimitReached = false;
    this.resultsLength = data.total_count;
    this.total_pages=data.total_pages;
    this.current_total=data.items.length;
    for(let i=0;i<data.items.length;i++){
      data.items[i].company_name=this.getCompanyName(data.items[i].company_id); 
      data.items[i].company_name_ar=this.getCompanyNameAr(data.items[i].company_id);
      data.items[i].company_name_en=this.getCompanyNameEn(data.items[i].company_id);
    }
    this.simsDatabase = new DB(data.items);
    this.paginator.pageIndex=0;
    this.dataSource = new DS(this.simsDatabase, this.sort, this.paginator);
  }
  prev(){
    if(this.pageIndex>1){
      this.pageIndex=this.pageIndex-1;
      let active=this.sort.active?this.sort.active:'id';
      let direction=this.sort.direction?this.sort.direction:'asc';
      let search=this.filter.nativeElement.value;
      this.loading = true;
      this.simService!.get(active, direction, this.pageIndex,search).subscribe(data => {this.init_data(data);});
    }
  }
  next(){
    if(this.pageIndex<this.total_pages){
      this.pageIndex=this.pageIndex+1;
      let active=this.sort.active?this.sort.active:'id';
      let direction=this.sort.direction?this.sort.direction:'asc';
      let search=this.filter.nativeElement.value;
      this.loading = true;
      this.simService!.get(active, direction, this.pageIndex,search).subscribe(data => {this.init_data(data);});
    }
  }
  getCompanyName(id:number){
    if(id==0 || !this.companies){
      return '';
    }
    return this.companies.filter(
      company => company.id === id)[0].name;
  }
  getCompanyNameAr(id:number){
    if(id==0 || !this.companies){
      return '';
    }
    return this.companies.filter(
      company => company.id === id)[0].name_ar;
  }
  getCompanyNameEn(id:number){
    if(id==0 || !this.companies){
      return '';
    }
    return this.companies.filter(
      company => company.id === id)[0].name_en;
  }
  getTheCompany(row){
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
  
  public loadSims(){
    this.simService.get('id','ASC',1,'').subscribe(res=>{
      this.loading=false;
      if(!res['message']){
        this.sims = res.items.reverse();
        this.ngOnInit();
      }
    });
  }
  openAddDialog(): void {
    let dialogRef=this.dialog.open(AddSimComponent, {
      width:'310px',
      data:{sim:this}
    });
    dialogRef.afterClosed().subscribe();
  }
  edit(row:Sim){
    this.setSimForm(row);
    let dialogRef = this.dialog.open(EditSimComponent, {
      width: '310px',
      data: { sim:this,item:row,simForm:this.simForm}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  upload() {
    this.loading=true;
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.simService.addExcel(fileBrowser.files[0]).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.excelSims=r.data;
            this.loading=false;
            this.formOnInit({});
            this.openAddDialog();
          }
      });
    }
  }
  displayedColumns = [ 'sim','agent_id','company_id','used','id'];
  simsDatabase = new DB([]);
  dataSource: DS | null;
  
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
    private simService:SimService,
    public snackBar: MdSnackBar,private trans:TranslateService,
    private lsService:LocalStorageService,
    private authService:AuthenticationService) {
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
    this.simService.delete(id).subscribe(res=>{
      
      this.snackBar.openFromComponent(MsgComponent,{
        duration: 3000,
        horizontalPosition:'right',
        data:{title:todelete,detail:this.data.sim,art:'delete',place:'sim'}
      });
      this.data.loading=false;
    });
  }
}