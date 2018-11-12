import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { ProductAgent } from '../model/product_agent';
import 'rxjs';
import * as AppConst from './../app.const'; 
@Injectable()
export class ProductAgentService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  getProductAgent(product_id:number,agent_id:number) :Observable<Array<ProductAgent>>{
    return this.http.get(this.apiRoot+'product_agent/get.php?product_id='+product_id+'&agent_id='+agent_id, this.options).map(x=>x.json());
  }
  
  constructor(private _http:Http) { 
    this.http = _http;
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
  }
}
