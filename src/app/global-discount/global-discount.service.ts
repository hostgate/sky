import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { User } from "../model/user";
import { Level } from "../model/level";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import { AuthenticationService } from "../login/authentication.service";
import * as AppConst from './../app.const'; 
import { AgentDiscount } from '../model/agent_discount';

@Injectable()
export class GlobalDiscountService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,
    private authenticationService: AuthenticationService) { 
    this.http = _http;
  }
  getDiscounts(id:number=0):Observable<Array<AgentDiscount>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    let url:string='discount/get.php';
    if(id>0){
      url+='?id='+id;
    }
    return this.http.get(this.apiRoot+url,this.options).map(x=>x.json());
  }
  add(discount:AgentDiscount){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.post(this.apiRoot+'discount/add.php', discount, this.options); 
  }
  update(discount:AgentDiscount) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'discount/edit.php', discount, this.options);     	    
  }
  delete(id:number){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
     return this.http.delete(this.apiRoot+'discount/delete.php?id='+id, this.options );  
  }
}
