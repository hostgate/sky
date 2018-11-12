import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhoneService } from '../phone.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { MemberService } from '../../member/member.service';
import { OrderService } from '../../order/order.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { MdDialog, MdPaginatorIntl, MdSort, MdPaginator } from '@angular/material';
import { CompleteComponent } from '../../order/complete/complete.component';
import { DeleteComponent } from '../../order/delete/delete.component';
import { DeclineComponent } from '../../order/decline/decline.component';
import { CancelComponent } from '../../order/cancel/cancel.component';
import { SettingsService } from '../../settings/settings.service';
import { AddComponent } from '../../order/add/add.component';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { AddOrderComponent } from '../add-order/add-order.component';
import { AddMemberComponent } from '../../member/add-member/add-member.component';
import { MemberComponent } from '../../member/member/member.component';
import { PhoneComponent } from '../phone/phone.component';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
import { ConfirmTransComponent } from '../confirm-trans/confirm-trans.component';
import { HotmobileStatusService } from '../../hotmobile-status/hotmobile-status.service';
import { CellcomStatusService } from '../../cellcom-status/cellcom-status.service';
import { RefreshConnectComponent } from '../../report/refresh-connect/refresh-connect.component';
import { DisconnectMemberComponent } from '../../report/disconnect-member/disconnect-member.component';
@Component({
  selector: 'app-phone-info',
  templateUrl: './phone-info.component.html',
  styleUrls: ['./phone-info.component.css'],
  providers:[MemberComponent,PhoneComponent]
})
export class PhoneInfoComponent implements OnInit {
  id:number;
  phone:any=null;
  member:any=null;
  orders:any[]=null;
  completedOrder:any=null;
  loading:boolean=false;
  lan:string;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  displayedColumns = [ 'last_update_sec','agent_name','product_name','status','id'];
  db = new DB([]);
  ds: DS | null;
  initOrderDatabase(){
    if(this.orders && this.orders.length>1){
      this.orders=this.orders.reverse()
    }
    this.db = new DB(this.orders);
    this.ds = new DS(this.db, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.ds) { return; }
      this.ds.filter = this.filter.nativeElement.value;
    });
  }
  edit_phone:Boolean=false;
  edit_sim:Boolean=false;
  sPhone: string = '';
  sSim: string = '';
  newPhone:any=null;
  newSim:any=null;
  newPhones:any[]=null;
  newSims:any[]=null;
  searchPhones:any[]=[];
  searchSims:any[]=[];
  choose_new_phone:Boolean=false;
  choose_new_sim:Boolean=false;
  openEditPhone(){
    this.edit_phone=!this.edit_phone;
  }
  openEditSim(){
    this.edit_sim=!this.edit_sim;
  }
  searchNewPhone(event){
    let val=event.target.value;
    if(val=='') return this.searchPhones=[];
    this.searchPhones=this.newPhones.filter(el=>el.phone.indexOf( val )>=0);
  }
  searchNewSim(event){
    let val=event.target.value;
    if(val=='') return this.searchSims=[];
    this.searchSims=this.newSims.filter(el=>el.sim.indexOf( val )>=0);
  }
  chooseNewPhone(sp){
    this.newPhone=sp;
    this.sPhone='';
    this.searchPhones=[];
    this.choose_new_phone=true;
  }
  chooseNewSim(sp){
    this.newSim=sp;
    this.sSim='';
    this.searchSims=[];
    this.choose_new_sim=true;
  }
  unchooseNewPhone(){
    this.choose_new_phone=false;
    this.newPhone=null;
  }
  unchooseNewSim(){
    this.choose_new_sim=false;
    this.newSim=null;
  }
  acceptNewPhone(old_phone,new_phone){
    this.phoneService.acceptNewPhone(old_phone,new_phone).subscribe(res=>{
      this.ngOnInit();
    });
    this.edit_phone=false;
  }
  loading2:Boolean=false;
  acceptNewSim(old_sim,new_sim){
    this.loading2=true;
    this.phoneService.acceptNewSim(old_sim,new_sim.id).subscribe(res=>{
      let _phone=(this.phone.moved_to_phone!='0' && this.phone.accepted_moved_to_phone=='1')?this.phone.moved_to_phone:this.phone.phone;
      //console.log('_phone',_phone);
      //console.log('new_sim',new_sim);
      if(this.phone && this.phone.company_id==1){
        this.hotmobileStatusService.change_sim_all(_phone,new_sim.sim).subscribe(res1=>{
          this.loading2=false;
          this.ngOnInit();
        });
      }
      else{
        this.cellcomStatusService.change_sim_all(_phone,new_sim.sim).subscribe(res2=>{
          this.loading2=false;
          this.ngOnInit();
        });
      }
     // this.ngOnInit();
    });
    this.edit_sim=false;
  }
  lnp:Boolean=true;
  lns:Boolean=true;
  constructor(
    public dialog: MdDialog,
    private mdPaginatorIntl:MdPaginatorIntl,
    private route: ActivatedRoute,
    private router:Router,
    private phoneService:PhoneService,
    private memberService:MemberService,
    private orderService:OrderService,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private settingsService:SettingsService,
    public mc:MemberComponent,
    public pc:PhoneComponent,
    private excelService:ExcelService,
    public authService:AuthenticationService,
    private hotmobileStatusService:HotmobileStatusService,
    private cellcomStatusService:CellcomStatusService
  ) { 
              this.lan=this.lsService.getStorage('lan');
              this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
                this.lan=event.lang;
                
              });
             }
             transStatus(status){
              switch(status){
                case 'new':
                 return 'חדש';
                 case 'declined':
                 return 'נדחה';
                 case 'cancel':
                 return 'מובטל';
                 case 'completed':
                 return 'פעיל';
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
                  'id':el.id,
                  'עדכון אחרון':el.last_update,
                  'טלפון':el.phone,
                  'סוכן':el.agent_name,
                  'סים':el.sim,
                  'חברה':el.company_name,
                  'חבילה':el.product_name,
                  'סטטוס':this.transStatus(el.status) ,
                  'פעיל עד':el.status==='completed'?('עד :'+el.completed_date):'לא פעיל'
                }
                excel.push(a);
              });
              this.excelService.exportAsExcelFile(excel, 'הזמנות למספר '+this.phone.phone);
            }
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.id =+params['id'];
        this.loadPhone(this.id);
        // if(this.phone!=null){
        //   this.loadMember();
        // }
     });
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
    confirm_trans(){
      let dialogRef=this.dialog.open(ConfirmTransComponent,{
        width:'310px',
        data:{id:this.id,phone:this.phone,data:this}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
      });
    }
    loadPhone(phone_id:number){
      this.loading=true;
      this.phoneService.getPhone(phone_id).subscribe(
        res=>{
          this.phone=res;
          if(this.phone && this.phone.agent_id!=0 && this.phone.used=='0' && !this.authService.belongsToUser(this.phone.agent_id)){
            this.router.navigate(['/']);
          }
          else{
            this.loadMember();
            this.loading=false;
          } 
        }
      );
    }
    newOrder(){
      let dialogRef=this.dialog.open(AddOrderComponent,{
        width:'310px',
        data:{id:this.id,order:this.orders[0],data:this}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.loadPhone(this.id);
      });
    }
    newMember(phone){
      this.mc.openAddDialog2(phone);
    }
    deleteMember(member){
      this.mc.delete2(member,this.router.url);
    }
    deletePhone(phone){
      this.pc.delete2(phone);
    }
    loadMember(){
      this.loading=true;
      this.memberService.getPhoneMember(this.phone.id).subscribe(
        res=>{
            this.member=res;
            this.lnp=true;
            this.phoneService.getNewPhones(res.phone_id,res.agent_id).subscribe(r=>{
              this.lnp=false;
              this.newPhones=r;
            });
            this.lns=true;
            this.phoneService.getNewSims(res.sim_id,res.agent_id).subscribe(r=>{
              this.lns=false;
              this.newSims=r;
            });
            if(!this.authService.belongsToUser(this.member.agent_id) && this.phone.used=='1' && this.member.free=='0'){
              this.router.navigate(['/']);
            }
            else{
              this.loadOrders();
              this.loading=false;
            }
         
        }
      );
    }
    lastOrder:any=null;
    loadOrders(){
     
    this.loading=true;
     this.orderService.getMemberOrders(this.member.id).subscribe(
      res=>{
        
        this.orders=res;
        this.lastOrder=this.orders[0];
        if(this.orders.length>0){
          let completedOrders=this.orders.filter(el=>el.status==='completed');
          if(completedOrders.length>0){
            this.completedOrder=completedOrders[0];
          }
          this.orders=this.orders.reverse();
        }
        if(this.orders && this.orders.length>0 && this.authService.isAgent()){
          this.orders=this.orders.filter(el=>(el.agent_id==this.authService.getCurrentUserId()))
        }
        
        this.initOrderDatabase();
        if( this.orders.length>0 && this.orders[0].status=='completed'){
          this.getTimeToCancel();
        }
        this.timeout();
        this.loading=false;
      }
    );
  }
  getTimeToCancel(){
    this.settingsService.getSettings(1).subscribe(res=>{
      if( this.orders.length>0 &&res && !res['message'] && res[0]){
        this.timeToActiveCancel=parseFloat(res[0]._value)*60*60+parseFloat(this.orders[0].valid_from_sec );
      }
      else{
        this.timeToActiveCancel=-100;
      }
    });
  }
  timeToActiveCancel:any=null;
  restTimeToCancel:any;
  restTimeToCancelH:any;
  restTimeToCancelM:any;
  restTimeToCancelS:any;
  currentTime:any;
  timeout() {
    setTimeout( ()=> {
        this.settingsService.getTime().subscribe(t=>{
          let tt:any=t; 
          this.currentTime=tt._body;
          this.restTimeToCancel=(this.timeToActiveCancel-tt._body).toFixed(0);
          this.restTimeToCancelM = Math.floor(this.restTimeToCancel / 60);
          this.restTimeToCancelS = this.restTimeToCancel - this.restTimeToCancelM  * 60;
          this.restTimeToCancelH = Math.floor(this.restTimeToCancel / 3600);
          this.restTimeToCancelM= this.restTimeToCancelM%60;
          if(this.timeToActiveCancel==null||(this.timeToActiveCancel!=null && (this.timeToActiveCancel-tt._body)>=0)){
            if((this.orders[0]!=null && this.orders[0].status=='completed'))
            this.timeout();
          }
          
        });
    }, 1000);
  }
  getProductName(product){
    let c=product.product_name;
    if(this.lan=='he') return c;
    if(this.lan=='ar'){
     if(product.product_name_ar!=''){
       c=product.product_name_ar;
     }
    }
    else{
     if(product.product_name_en!=''){
       c=product.product_name_en;
     }
    }
    return c;
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
  complete(){
    let dialogRef=this.dialog.open(CompleteComponent,{
      width:'310px',
      data:{id:this.id,order:this.orders[0],data:this,url:this.router.url,phone_id:this.id}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPhone(this.id);
    });
  }
  delete(row){
    let dialogRef=this.dialog.open(DeleteComponent,{
      width:'310px',
      data:{id:row.id,order:row,data:this,url:this.router.url,phone_id:this.id}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPhone(this.orders[0].id);
      
    });
    
  }
  decline(){
    let dialogRef=this.dialog.open(DeclineComponent,{
      width:'310px',
      data:{id:this.orders[0].id,order:this.orders[0],data:this,url:this.router.url,phone_id:this.id}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPhone(this.orders[0].id);
      
    });
  }
  cancel(){
    let dialogRef=this.dialog.open(CancelComponent,{
      width:'310px',
      data:{id:this.orders[0].id,order:this.orders[0],data:this,url:this.router.url,phone_id:this.id}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPhone(this.orders[0].id);
      
    });
  }
}
