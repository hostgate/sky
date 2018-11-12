import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Sim } from '../model/sim';
import 'rxjs';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';
@Injectable()
export class SimService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
  }
  getAllSims() :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?all=1', this.options).map(x=>x.json());
  }
  getSims() :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php', this.options).map(x=>x.json());
  }
  getAgentCompanySims(agent:number=0,company:number=0) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?agent='+agent+'&company='+company, this.options).map(x=>x.json());
  }
  getNotUsedAgentCompanySims(agent:number=0,company:number=0) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?used=0&agent='+agent+'&company='+company, this.options).map(x=>x.json());
  }
  getUsedAgentCompanySims(agent:number=0,company:number=0) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?used=1&agent='+agent+'&company='+company, this.options).map(x=>x.json());
  }
  getSearchAgentCompanySims(agent:number=0,company:number=0,search:string) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?search='+search+'&agent='+agent+'&company='+company,this.options).map(x=>x.json());
  }
  getSearchNotUsedAgentCompanySims(agent:number=0,company:number=0,search:string) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?search='+search+'&used=0&agent='+agent+'&company='+company,this.options).map(x=>x.json());
  }
  getSearchUsedAgentCompanySims(agent:number=0,company:number=0,search:string) :Observable<Array<Sim>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?search='+search+'&used=1&agent='+agent+'&company='+company,this.options).map(x=>x.json());
  }
  getSim(id) :Observable<Sim>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?id='+id, this.options).map(x=>x.json());
  }
  getSimOther(id) :Observable<Sim>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?other=1&id='+id, this.options).map(x=>x.json());
  }
  getSearch(search:string){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.get(this.apiRoot+'sim/get.php?search='+search, this.options).map(x=>x.json());
  }
  add(sim:Sim[]) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.post(this.apiRoot+'sim/add.php', sim, this.options);     	    
  }
  addExcel(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'sim/add_excel.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  update(sim:Sim) {
    return this.http.put(this.apiRoot+'sim/edit.php', sim, this.options);     	    
  }
  delete(id:number){
     return this.http.delete(this.apiRoot+'sim/delete.php?id='+id, this.options );  
  }
}