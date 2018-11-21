import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import { Order } from '../model/order';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';
@Injectable()
export class OrderService {

  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
  }
  delete(id:number){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.delete(this.apiRoot+'order/delete.php?id='+id, this.options ); 
  }
  getOptions(){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
   return  new RequestOptions({headers: headers});
  }
  getCountNewOrders() :Observable<any>{
    return this.http.get(this.apiRoot+'notification/get_count_new_orders.php', this.getOptions()).map(x=>x.json());
  }
  getCountCancelOrders() :Observable<any>{
    return this.http.get(this.apiRoot+'notification/get_count_cancel_orders.php', this.getOptions()).map(x=>x.json());
  }
  decline(order:Order){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'order/declined.php', order,this.options ); 
  }
  changeSeen(order){
    return this.http.put(this.apiRoot+'order/change_seen.php', order,this.getOptions() ); 
  }
  cancel(order:Order){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'order/canceld.php', order,this.options); 
  }
  cancelCompleted(order:Order){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'order/cancelCompleted.php', order,this.options); 
  }
  add(orders:any[]) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'order/add.php', orders, this.options);     	    
  }
  createOrders(orders:any) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'order/createOrders.php', orders, this.options);     	    
  }
  createOrders2(orders:any) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'order/createOrders2.php', orders, this.options);     	    
  }
  completed(order:Order) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'order/completed.php', order,this.options); 	    
  }
  set_automatic_update(order_id,months){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    let data:any={id:order_id};
    if(months && months!=null && parseInt(months)>0 && parseInt(months)<12){
      data.months=parseInt(months);
    }
    
    return this.http.put(this.apiRoot+'order/set_automatic_update.php', data,this.options); 	    
  }
  
  release_member(order:Order) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'order/release_member.php', order,this.options); 	    
  }
  getOrders() :Observable<Array<Order>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'order/get.php', this.options).map(x=>x.json());
  }
  getOrdersReport(all=1,page=1,limit=100) :Observable<any>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'order/orders_report.php?all='+all+'&page='+page+'&limit='+limit, this.options).map(x=>x.json());
  }
  getMemberOrders(member_id) :Observable<Array<Order>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'order/get.php?member_id='+member_id, this.options).map(x=>x.json());
  }
  getOrder(id:number) :Observable<Order>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'order/get.php?id='+id, this.options).map(x=>x.json());
  }
  loadExcel(data){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'excel/load.php', data, this.options);
  }
}
