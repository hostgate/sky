import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import * as AppConst from './../app.const';
@Injectable()
export class BlockPackegesService {

  http: Http;
  headers: Headers;
  apiRoot:String=AppConst.API_ENDPOINT;
  getOptions(){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    return new RequestOptions({headers: headers});
  }
  get() :Observable<Array<any>>{
    return this.http.get(this.apiRoot+'block_packages/get.php', this.getOptions()).map(x=>x.json());
  }
  getAgentProducts(id){
    return this.http.get(this.apiRoot+'block_packages/get_agent_products.php?id='+id, this.getOptions()).map(x=>x.json());
  }
  delete(id:number){
     return this.http.delete(this.apiRoot+'block_packages/delete.php?id='+id, this.getOptions() );  
  }
  active(id:number){
      return this.http.put(this.apiRoot+'block_packages/active.php?id='+id,{id:id},this.getOptions() );  
  }
  constructor(private _http:Http) { 
    this.http = _http;
  }
  add(block) {
    return this.http.post(this.apiRoot+'block_packages/add.php', block, this.getOptions());     	    
  }
}
