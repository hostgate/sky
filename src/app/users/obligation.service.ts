import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Obligation } from "../model/obligation";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import { AuthenticationService } from "../login/authentication.service";
import * as AppConst from './../app.const'; 
@Injectable()
export class ObligationService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  getObligations() :Observable<Array<Obligation>>{
    return this.http.get(this.apiRoot+'obligation/get.php',this.options).map(x=>x.json());
  }
  getObligation(id:number) :Observable<Obligation>{
    return this.http.get(this.apiRoot+'obligation/get.php?agent_id='+id,this.options).map(x=>x.json());
  }
  edit(obligation){
    return this.http.put(this.apiRoot+'obligation/edit.php', obligation,this.options);   
  }
 
  constructor(private _http:Http,
    private authenticationService: AuthenticationService) { 
    this.http = _http;
    let headers = new Headers({'Content-Type': 'application/json'});  
    
    
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
   
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
  }
}
