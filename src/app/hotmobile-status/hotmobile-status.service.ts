import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class HotmobileStatusService {

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
  get(phone):Observable<any>{
    return this.http.get(this.apiRoot+'status_hotmobile/hot.php?phone='+phone,this.getOptions()).map(x=>x.json());
  }
  connect(phone){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,action:'connect'},  this.getOptions()).map(x=>x.json());
  }
  connect7(phone){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,action:'connect7'},  this.getOptions()).map(x=>x.json());
  }
  disconnect(phone){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,action:'disconnect'},this.getOptions()).map(x=>x.json());
  }
  disconnect6(phone){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,action:'disconnect6'},this.getOptions()).map(x=>x.json());
  }
  disconnect_all(phone){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,action:'disconnect',all:'1'},  this.getOptions()).map(x=>x.json());
  }
  change_sim(phone,sim){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,sim:sim,action:'change_sim'},  this.getOptions()).map(x=>x.json());
  }
  change_sim_all(phone,sim){
    return this.http.put(this.apiRoot+'status_hotmobile/hot.php',{phone:phone,sim:sim,action:'change_sim',all:'1'},  this.getOptions()).map(x=>x.json());
  }
}
