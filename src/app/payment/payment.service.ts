import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Payment } from '../model/payment';
import 'rxjs';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class PaymentService {
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
    return this.http.delete(this.apiRoot+'payment/delete.php?id='+id, this.options ); 
  }
  add(payments:Payment[]) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'payment/add.php', payments, this.options);     	    
  }
  addRest(payment) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'payment/add_rest.php', payment, this.options);     	    
  }
  getPayments() :Observable<Array<Payment>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'payment/get.php', this.options).map(x=>x.json());
  }
  getAgentPayments(agent_id:number) :Observable<Array<Payment>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'payment/get.php?agent_id='+agent_id, this.options).map(x=>x.json());
  }
  getPayment(id:number) :Observable<Array<Payment>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'payment/get.php?id='+id, this.options).map(x=>x.json());
  }
  update(payment:Payment) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.put(this.apiRoot+'payment/edit.php', payment,this.options); 	    
  }
}
