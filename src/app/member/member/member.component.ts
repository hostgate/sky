import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MemberService } from '../member.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar, MdDialog, MdPaginatorIntl, MdSort, MdPaginator } from '@angular/material';
import { Member } from '../../model/member';
import { ConsumerService } from '../../consumer/consumer.service';
import { UsersService } from '../../users/users.service';
import { SimService } from '../../sim/sim.service';
import { PhoneService } from '../../phone/phone.service';
import { ValidationService } from '../../validation.service';
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { Message } from 'primeng/components/common/message';
import { CompanyService } from '../../company/company.service';
import { Company } from '../../model/company';
 import { Observable } from 'rxjs/Observable';
import { Sim } from '../../model/sim';
import { Phone } from '../../model/phone';
import { AddMemberComponent } from '../add-member/add-member.component';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PhoneInfoComponent } from '../../phone/phone-info/phone-info.component';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { BlockMemberComponent } from '../block-member/block-member.component';
import { ResetMemberComponent } from '../reset-member/reset-member.component';
import {merge} from 'rxjs/observable/merge';
import {of as observableOf} from 'rxjs/observable/of';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  members:Member[];
  companies:Company[];
  loading:Boolean=true;
  msgs: Message[] = [];
  item:Member;
  memberForm:FormGroup;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  lan:any;
  agents:any[]=null;
  constructor(
    private memberService:MemberService,
    private userService:UsersService,
    private consumerService:ConsumerService,
    private companyService:CompanyService,
    private simService:SimService,
    private phoneService:PhoneService,
    private validationService:ValidationService,
    private formBuilder:FormBuilder,
    public dialog: MdDialog,
    private router:Router,
    private mdPaginatorIntl:MdPaginatorIntl,
    private trans:TranslateService, 
    private lsService:LocalStorageService,
    private route:ActivatedRoute,
    private excelService:ExcelService,
    public authService:AuthenticationService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-member');
  }
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  total_pages=0;
  current_total=0;
  pageIndex=0;
  agent_id:any=0;
  status:any=0;
  prev(){
    if(this.pageIndex>1){
      this.pageIndex=this.pageIndex-1;
      let active=this.sort.active?this.sort.active:'id';
      let direction=this.sort.direction?this.sort.direction:'asc';
      let search=this.filter.nativeElement.value;
      this.loading = true;
      this.memberService!.get(active, direction, this.pageIndex,search,this.agent_id,this.status).subscribe(data => {this.init_data(data);});
    }
  }
  next(){
    if(this.pageIndex<this.total_pages){
      this.pageIndex=this.pageIndex+1;
      let active=this.sort.active?this.sort.active:'id';
      let direction=this.sort.direction?this.sort.direction:'asc';
      let search=this.filter.nativeElement.value;
      this.loading = true;
      this.memberService!.get(active, direction, this.pageIndex,search,this.agent_id,this.status).subscribe(data => {this.init_data(data);});
    }
  }
  getPhone(el){
    if(el.moved_to_phone && el.moved_to_phone!=0) return el.moved_to_phone; return el.phone;
   }
  loadExcel(){
    let excel:any=[];
    this.dataSource.getFSData().forEach(el=>{
      let a:any={
        'id':el.id,
        'סוכן':el.agent_name,
        'פעיל':el.active===1?'כן':'לא',
        'חברה':el.company_name,
        'טלפון':  this.getPhone(el),
        'מניוד ל':el.moved_to_phone==='0'?'':el.moved_to_phone, 
        'סים':el.sim

      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים');
  }
  loadExcel2(){
    this.loading=true;
   this.memberService.getExcel(this.filter.nativeElement.value,this.agent_id,this.status).subscribe(res=>{
      this.loading=false;
      let excel:any=[];
      res.items.forEach(el=>{
      let a:any={
        'id':el.id,
        'סוכן':el.agent_name,
        'פעיל':el.active===1?'כן':'לא',
        'חברה':el.company_name,
        'טלפון':  this.getPhone(el),
        'מניוד ל':el.moved_to_phone==='0'?'':el.moved_to_phone, 
        'סים':el.sim
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'מנויים');
   })
  }
  formOnInit(member:Member){
    let agent_id=null;
    if(this.authService.isAgent()){
      agent_id=this.authService.getCurrentUserId();
    }
    else{
      agent_id=member.agent_id;
    }
    let fb:any={
      'agent_id':agent_id?[agent_id, Validators.required]:[null, Validators.required],
      'consumer_id':member.consumer_id?[member.consumer_id, Validators.required]:[null, Validators.required],
      'company_id':member.company_id?[member.company_id, Validators.required]:[null, Validators.required],
      'sim_id':member.sim_id?[member.sim_id, Validators.required]:[null, Validators.required],
      'phone_id':member.phone_id?[member.phone_id, Validators.required]:[null, Validators.required],
      'free':member.free?[member.free, Validators.required]:[true, Validators.required],
      'moved':[false],
      'moved_to_phone':['0'],
      'note':member.note?[member.note]:[''],
    };
    this.memberForm = this.formBuilder.group(fb);
  }
  formOnInitPhone(phone){
    let agent_id=null;
    if(this.authService.isAgent()){
      agent_id=this.authService.getCurrentUserId();
    }
    let fb:any={
      'agent_id':[agent_id, Validators.required],
      'consumer_id':[null, Validators.required],
      'company_id':[phone.company_id, Validators.required],
      'sim_id':[null, Validators.required],
      'phone_id':[phone.id, Validators.required],
      'free':[true, Validators.required],
      'moved':[false],
      'moved_to_phone':['0'],
      'note':[''],
    };
    this.memberForm = this.formBuilder.group(fb);
  }
  delete(id:number){
    let dialogRef=this.dialog.open(DeleteDialog,{
      width:'310px',
      data:{id:id,member:this.members.filter(member=> member.id==id)[0],data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  reset(id:number){
    let dialogRef=this.dialog.open(ResetMemberComponent,{
      width:'310px',
      data:{
        id:id,
        member:this.members.filter(member=>member.id==id)[0],
        data:this
      }
    });
    dialogRef.afterClosed().subscribe(result => { 
      this.ngOnInit();
    });
  }
  block(member,free){
    let dialogRef=this.dialog.open(BlockMemberComponent,{
      width:'310px',
      data:{id:member.id,member:member,data:this,free:free}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  delete2(member2:any,url){
    let dialogRef=this.dialog.open(DeleteDialog,{
      width:'310px',
      data:{url:url,id:member2.id,member:member2,data:this}
    });
    dialogRef.afterClosed().subscribe(result =>{});
  }
  setSimUsed(sim_id:number,used:boolean=true){
    let sim:Sim=new Sim();
    sim.id=sim_id;
    sim.used=used;
    this.loading=true;
    this.simService.update(sim).subscribe(res => {
      this.loading=false;
    });
  }
  setPhoneUsed(phone_id:number,used:boolean=true){
    let phone: Phone = new Phone();
    phone.id=phone_id;
    phone.used=used;
    this.loading=true;
    this.phoneService.update(phone).subscribe(res => {
      this.loading=false;
    });
  }
  selectAgent(){
    this.paginator.pageIndex = 0;
    this.pageIndex=0;
    this.ngOnInit();
  }
  selectStatus(){
    this.paginator.pageIndex = 0;
    this.pageIndex=0;
    this.ngOnInit();
  }
  ngOnInit() {
    this.userService.getAgents().subscribe(res=>{
      this.agents=res;
    })
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
            let active=this.sort.active?this.sort.active:'order_id';
            let direction=this.sort.direction?this.sort.direction:'desc';
            this.pageIndex=this.pageIndex+1
            let search=this.filter.nativeElement.value;
            this.loading = true;
            return this.memberService!.get(active, direction, this.pageIndex,search,this.agent_id,this.status);
          }).
          map(members => {
            if(this.authService.isAgent()){
              members.items=members.items.filter(el=>(el.agent_id==0||el.agent_id==this.authService.getCurrentUserId()));
            }
           return this.init_data(members);
          })
        .subscribe(data =>  {
      });
    this.loadCompanies();
  }
  addMember(member:Member){
    this.loading=true;
    this.memberService.add([member]).subscribe(res =>{
      this.loading=false;
      if(res['status']){
        this.ngOnInit();
      }
    }); 
  }
  addMember2(member:Member){
    this.loading=true;
    this.memberService.add([member]).subscribe(res =>{
      this.loading=false;
      if(res['status']){
        this.router.navigate(['/מספר-טלפון',member.phone_id]);
      }
    }); 
  }
  
  navigateToPhone(member,url){
    let u:boolean=decodeURIComponent(url).indexOf('/מספר-טלפון') !== -1;
    if(u){
      this.router.navigate(['/מספר',member.phone_id]);
    }
    else{
      this.router.navigate(['/מספר-טלפון',member.phone_id]);
    }
  }
  public openAddDialog(): void {
    let dialogRef=this.dialog.open(AddMemberComponent, {
      width:'310px',
      data:{member:this}
    });
    dialogRef.afterClosed().subscribe();
  }
  myLocation:string;
  public openAddDialog2(phone): void {
    let dialogRef=this.dialog.open(AddMemberComponent, {
      width:'310px',
      data:{member:this,phone:phone}
    });
    dialogRef.afterClosed().subscribe();
  }
  
  
 loadCompanies(){
   this.companyService.getCompanys().subscribe(res=>{
    if(!res['message']){
      this.companies=res;
    }
   });
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
  setMember(member:Member){
    if(member.sim_id!=null){
     this.simService.getSim(member.sim_id).subscribe(res=>{
          if(!res['message']){
            member.sim=res.sim;
            member.company_id=res.company_id;
            member.company_name=this.companies.filter(company=>company.id==member.company_id)[0].name;
          }
      });
    }
    if(member.consumer_id!=null){
      this.consumerService.getConsumer(member.consumer_id).subscribe(res=>{
          if(!res['message']){
            member.consumer_name=res.username;
            member.consumer_national_id=res.national_id;
          }
      });
    }
    if(member.agent_id!=null){
      this.userService.getUser(member.agent_id).subscribe(res=>{
          if(!res['message']){
            member.agent_name=res.username;
          }
      });
    }
    if(member.phone_id!=null){
      this.phoneService.getPhone(member.phone_id).subscribe(res=>{
          if(!res['message']){
            member.phone=res.phone;
          }
      });
    }
    return member;
  }
  displayedColumns = [ 'agent_name','status','company_name','phone','sim','id'];
  membersDatabase = new DB([]);
  dataSource: DS | null;
  initMemberDatabase(){
    this.membersDatabase = new DB(this.members);
    this.dataSource = new DS(this.membersDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      this.paginator.pageIndex = 0;
      this.pageIndex=0;
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
   
  }
  init_data(data){
    this.loading = false;
    this.isRateLimitReached = false;
    this.resultsLength = data.total_count;
    this.total_pages=data.total_pages;
    this.current_total=data.items.length;
    this.membersDatabase = new DB(data.items);
    this.paginator.pageIndex=0;
    this.dataSource = new DS(this.membersDatabase, this.sort, this.paginator);
  }
}
@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  providers: [YnPipe],
})
export class DeleteDialog {
  loading:Boolean=false;
  constructor(
    public dialogRef: MdDialogRef<DeleteDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private memberService:MemberService,
    public snackBar: MdSnackBar,
    private authService:AuthenticationService) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  delete(id:number,todelete:string){
    this.data.loading=true;
    this.memberService.delete(id).subscribe(res=>{
      let mes=this.data.member.id;
      this.snackBar.open(mes, todelete, {
        duration: 2000,
      });
      if(this.data.url){
        this.data.data.navigateToPhone(this.data.member,this.data.url);
      }
      this.data.loading=false;
    });
  }
}