import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ServerDateTime } from "./model/server_date_time";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import * as AppConst from './app.const'; 
import { Angular2TokenService } from 'angular2-token';
import 'rxjs'; 
@Injectable()
export class ServerDateTimeService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    if(jls && jls.token){
      let authToken=jls.token;
      headers.append('Authorization',`Bearer ${authToken}`);
    }
    else{
      headers.append('Authorization',`Bearer`);
    }
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
  
  }
}
