import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import * as AppConst from './app.const'; 
import { Angular2TokenService } from 'angular2-token';
@Injectable()
export class NotificationService {

  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
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
  getNewOrders() :Observable<Array<any>>{
    return this.http.get(this.apiRoot+'notification/get_new_orders.php', this.getOptions()).map(x=>x.json());
  }
  getCountCancelOrders() :Observable<any>{
    return this.http.get(this.apiRoot+'notification/get_count_cancel_orders.php', this.getOptions()).map(x=>x.json());
  }
  getCancelOrders() :Observable<Array<any>>{
    return this.http.get(this.apiRoot+'notification/get_cancel_orders.php', this.getOptions()).map(x=>x.json());
  }
  getCountTransPhones():Observable<any>{
    return this.http.get(this.apiRoot+'notification/get_count_trans_phones.php', this.getOptions()).map(x=>x.json());
  }
  getTransPhones():Observable<Array<any>>{
    return this.http.get(this.apiRoot+'notification/get_trans_phones.php', this.getOptions()).map(x=>x.json());
  }
}
