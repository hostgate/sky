import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { User } from "../model/user";
import { Level } from "../model/level";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import { AuthenticationService } from "../login/authentication.service";
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class IpPermissonService {

  getOptions(){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    return  new RequestOptions({headers: headers});
  }
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,
              private authenticationService: AuthenticationService,
              private tokenService: Angular2TokenService
            ){ 
      this.http = _http;
   }
  get() :Observable<Array<any>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'permissions/get.php', this.getOptions()).map(x=>x.json());
  }
  add(permisson) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.post(this.apiRoot+'permissions/add.php', permisson, this.options);     	    
  }
  active(permisson){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'permissions/active.php',permisson, this.options).map(x=>x.json());
   }
   delete(permisson){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.delete(this.apiRoot+'permissions/delete.php?id='+permisson.id, this.options); 
   }
}
