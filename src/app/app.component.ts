import { Component,OnInit,Input, Inject, HostListener } from '@angular/core';
import { ServerDateTimeService } from "./server-date-time.service";
import { ServerDateTime } from "./model/server_date_time";
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService, LangChangeEvent } from "ng2-translate";
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/Rx';
import { MatPaginatorIntl, MatSnackBar } from '@angular/material';
import { AuthenticationService } from './login/authentication.service';
import { NotificationService } from './notification.service';
import { MsgComponent } from './msg/msg.component';
import { LEFT_ARROW } from '@angular/cdk/keycodes';
import { SettingsService } from './settings/settings.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ServerDateTimeService]
})
export class AppComponent  implements OnInit {
  sidenav: any;
  title = 'app';
  dt:ServerDateTime[];
  isHomePage:boolean;
  @Input()
  lan:any;
  sno:boolean=false;
  hideMenu: Boolean=false;
  changeLan(lan: string) {
    this.translate.use(lan);
    this.lan=lan;
    this.lsService.setStorage('lan',lan,999999999999);
  }
  toggleMenu(){
    this.hideMenu=!this.hideMenu;
  }
  notification_time:number=10000;
  constructor(
    private serverDateTimeService:ServerDateTimeService,
    private lsService:LocalStorageService,
    private router:Router,
    private translate: TranslateService,
    private notification:NotificationService,
    public authService:AuthenticationService,
    @Inject('Window') window: Window,
    public snackBar: MatSnackBar,
    private trans:TranslateService,
    private settingsService:SettingsService) {
      if(this.isloged()){
        this.settingsService.getSettings(2).subscribe(res=>{
          this.notification_time=1000.0*parseInt(res[0]._value);
        });
      }
      
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
   router.events.subscribe((val) => {
      this.isHomePage=(this.router.url=='/');
      if(this.isHomePage){
        this.hideMenu=true;
      }
  });
    let lan=this.lsService.getStorage('lan');
    if(lan && lan!=null){
      translate.setDefaultLang(lan);
      translate.use(lan);
    }
    else{
      translate.setDefaultLang('he');
      translate.use('he');
    }
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   // do something
    //   this.translate.set('test', 'בדיקה', 'he');
    //   this.translate.set('test', 'سشيشس', 'ar');
    //   this.translate.set('test', 'test', 'en');
    // });
   
    this.lan=this.translate.currentLang;
    
  }
  changeHideMenu(){
    if(window.innerWidth<=768){
     this.sidenav.toggle();
      this.sno=false;
    }
  }
  ngOnInit() {
     this.timeoutNew();
    this.timeoutNew2();
    this.timeoutCancel();
    this.timeoutCancel2();
    this.timeoutTrans();
    this.timeoutTrans2();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(event.target.innerWidth<=768){
      this.hideMenu=true;
      this.sno=false;
    }
    else{
      this.hideMenu=false;
      this.sno=true; 
    }
    if(this.isHomePage){
      this.hideMenu=true;
     }
  }
  public  isloged(){
    return decodeURIComponent(this.router.url)!='/התחברות';
  }
  loading:boolean=false;
  count_new_orders:number=0;
  new_orders:any[]=[];
  count_cancel_orders:number=0;
  cancel_orders:any[]=[];
  count_trans_phones:number=0;
  trans_phones:any[]=[];
  loadNotificationNewCounts(){
    if(this.isloged() && this.authService.canUpdate()){
      this.notification.getCountNewOrders().subscribe(response=>{
          this.lsService.setStorage('count_new_orders',response,99999999999);
      });
    }
  }
  loadNotificationCancelCounts(){
    if(this.isloged() && this.authService.canUpdate()){
      this.notification.getCountCancelOrders().subscribe(response=>{
          this.lsService.setStorage('count_cancel_orders',response,99999999999);
      });
    }
  }
  loadNotificationTransCounts(){
    if(this.isloged() && this.authService.canUpdate()){
      this.notification.getCountTransPhones().subscribe(response=>{
          this.lsService.setStorage('count_trans_phones',response,99999999999);
      });
    }
  }
  timeoutNew() {
    setTimeout( ()=> {
      if(this.lsService.getStorage('count_new_orders') && this.lsService.getStorage('count_new_orders')!=null){
        this.count_new_orders=JSON.parse(this.lsService.getStorage('count_new_orders'));
      }
      else{
        this.count_new_orders=0;
        this.loadNotificationNewCounts();
       
      }
      if(this.lsService.getStorage('new_orders') && this.lsService.getStorage('new_orders')!=null){
        if(JSON.stringify(this.new_orders)!=this.lsService.getStorage('new_orders'))
        this.new_orders=JSON.parse(this.lsService.getStorage('new_orders'));
      }
      else{
        this.new_orders=[];
        this.loadNewOrders();
      }
      this.timeoutNew();
    }, this.notification_time);
  }
  timeoutCancel() {
    setTimeout( ()=> {
      if(this.lsService.getStorage('count_cancel_orders') && this.lsService.getStorage('count_cancel_orders')!=null){
        this.count_cancel_orders=JSON.parse(this.lsService.getStorage('count_cancel_orders'));
      }
      else{
        this.count_cancel_orders=0;
        this.loadNotificationCancelCounts();
       
      }
      if(this.lsService.getStorage('cancel_orders') && this.lsService.getStorage('cancel_orders')!=null){
        if(JSON.stringify(this.cancel_orders)!=this.lsService.getStorage('cancel_orders'))
        this.cancel_orders=JSON.parse(this.lsService.getStorage('cancel_orders'));
      }
      else{
        this.cancel_orders=[];
        this.loadCancelOrders();
      }
      this.timeoutCancel();
    }, this.notification_time);
  }
  timeoutTrans() {
    setTimeout( ()=> {
      if(this.lsService.getStorage('count_trans_phones') && this.lsService.getStorage('count_trans_phones')!=null){
        this.count_trans_phones=JSON.parse(this.lsService.getStorage('count_trans_phones'));
      }
      else{
        this.count_trans_phones=0;
        this.loadNotificationTransCounts();
       
      }
      if(this.lsService.getStorage('trans_phones') && this.lsService.getStorage('trans_phones')!=null){
        if(JSON.stringify(this.trans_phones)!=this.lsService.getStorage('trans_phones'))
        this.trans_phones=JSON.parse(this.lsService.getStorage('trans_phones'));
      }
      else{
        this.trans_phones=[];
        this.loadTransPhones();
      }
      this.timeoutTrans();
    }, this.notification_time);
  }
  timeoutNew2(){
    setTimeout( ()=> {
      this.loadNotificationNewCounts();
      this.loadNewOrders();
      this.timeoutNew2();
    }, this.notification_time);
  }
  timeoutCancel2(){
    setTimeout( ()=> {
      this.loadNotificationCancelCounts();
      this.loadCancelOrders();
      this.timeoutCancel2();
    }, this.notification_time);
  }
  timeoutTrans2(){
    setTimeout( ()=> {
      this.loadNotificationTransCounts();
      this.loadTransPhones();
      this.timeoutTrans2();
    }, this.notification_time);
  }
  loadNewOrders(){
    this.loading=true;
    if(this.isloged() &&this.authService.canUpdate()){
    this.notification.getNewOrders().subscribe(response=>{
      this.loading=false;
      this.new_orders=[];
      response.forEach(el=>{
        this.new_orders.push({'id':el.id,'username':el.username,'created_at':el.created_at});
      });
      let new_no=JSON.stringify(this.new_orders);
      let old_no=this.lsService.getStorage('new_orders');
      if(new_no!=old_no){
        this.lsService.setStorage('new_orders',new_no,99999999999);
        this.snackBarNewOrder(JSON.parse(new_no),JSON.parse(old_no));
      }
    });
    }
  }
  loadCancelOrders(){
    this.loading=true;
    if(this.isloged() &&this.authService.canUpdate()){
    this.notification.getCancelOrders().subscribe(response=>{
      this.loading=false;
      this.cancel_orders=[];
      response.forEach(el=>{
        this.cancel_orders.push({'id':el.id,'username':el.username,'cancel_from':el.cancel_from});
      });
      let new_co=JSON.stringify(this.cancel_orders);
      let old_co=this.lsService.getStorage('cancel_orders');
      if(new_co!=old_co){
        this.lsService.setStorage('cancel_orders',new_co,99999999999);
        this.snackBarCancelOrder(JSON.parse(new_co),JSON.parse(old_co));
      }
    });
    }
  }
  loadTransPhones(){
    this.loading=true;
    if(this.isloged() &&this.authService.canUpdate()){
    this.notification.getTransPhones().subscribe(response=>{
      this.loading=false;
      this.trans_phones=[];
      response.forEach(el=>{
        this.trans_phones.push({'id':el.id,'phone':el.phone,'moved_to_phone':el.moved_to_phone,'created_at':el.created_at});
      });
      let new_tp=JSON.stringify(this.trans_phones);
      let old_tp=this.lsService.getStorage('trans_phones');
      if(new_tp!=old_tp){
        this.lsService.setStorage('trans_phones',new_tp,99999999999);
        this.snackBarTransPhones(JSON.parse(new_tp),JSON.parse(old_tp));
      }
    });
    }
  }
  snackBarNewOrder(n,o){
    let nn:any[]=[];
    if(o==null || o===null){
      nn=n;
    }
    else{
      n.forEach(nel=>{
        let a= o.filter(oel=>oel.id==nel.id);
        if(a.length==0){
         nn.push(nel);
        }
       });
    }
    if(nn.length>0){
      this.snackBar.openFromComponent(MsgComponent, {
        duration: 7000,
        horizontalPosition:'right',
        data:{data:nn,art:'new',place:'notification'}
      });
    }
  }
  snackBarCancelOrder(n,o){
    let nn:any[]=[];
    if(o==null || o===null){
      nn=n;
    }
    else{
      n.forEach(nel=>{
        let a= o.filter(oel=>oel.id==nel.id);
        if(a.length==0){
         nn.push(nel);
        }
       });
    }
    if(nn.length>0){
      this.snackBar.openFromComponent(MsgComponent,{
        duration: 7000,
        horizontalPosition:'right',
        data:{data:nn,art:'cancel',place:'notification'}
      });
    }
  }
  snackBarTransPhones(n,o){
    let nn:any[]=[];
    if(o==null || o===null){
      nn=n;
    }
    else{
      n.forEach(nel=>{
        let a= o.filter(oel=>oel.id==nel.id);
        if(a.length==0){
         nn.push(nel);
        }
       });
    }
    if(nn.length>0){
      this.snackBar.openFromComponent(MsgComponent,{
        duration: 7000,
        horizontalPosition:'right',
        data:{data:nn,art:'trans',place:'notification'}
      });
    }
  }
}
