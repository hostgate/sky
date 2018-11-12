import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import { AuthenticationService } from "../login/authentication.service";
import * as AppConst from './../app.const'; 

@Injectable()
export class SettingsService {

  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,
              private authenticationService: AuthenticationService) { 
      this.http = _http;
   }
  getSettings(id) :Observable<Array<{id:number,_key:string,_value:string,description:string,active}>>{
    let get="";
    if(id>0){
      get="?id="+id;
    }
    return this.http.get(this.apiRoot+'settings/get.php'+get).map(x=>x.json());
  }
  update(setting:{id:number,_key:string,_value:string,description:string,active}) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'settings/edit.php', setting, this.options);     	    
  }
  getTime(){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'settings/time.php', this.options); 
  }

}
