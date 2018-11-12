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
export class AgentService {
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
   getCountPorductsWithExtension(agent_id){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'user/get_count_porducts_with_extension.php?agent_id='+agent_id, this.options).map(x=>x.json());
   }
   ResetPorductsWithExtension(agent){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/reset_porducts_with_extension.php',agent, this.options).map(x=>x.json());
   }
   getCountBlockedMembers(agent_id){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'user/get_count_blocked_members.php?agent_id='+agent_id, this.options).map(x=>x.json());
   }
   getAgreements(agent_id){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'user/get_agreements.php?agent_id='+agent_id, this.options).map(x=>x.json());
   }
   getNotes(agent_id){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'user/get_notes.php?agent_id='+agent_id, this.options).map(x=>x.json());
   }
   addNote(note) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.post(this.apiRoot+'user/add_note.php', note, this.options);     	    
  }
   ResetBlockedMembers(agent){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/reset_blocked_members.php',agent, this.options).map(x=>x.json());
   }
   set_price_change(agent:any) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/set_price_change.php', agent,this.options);     	    
  }
  set_block_my_members(agent:any) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/set_block_my_members.php', agent,this.options);     	    
  }
  allow_account_exception_f(agent:any){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/allow_account_exception_f.php', agent,this.options);   
  }
  receiving_messages(agent:any){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/receiving_messages.php', agent,this.options);   
  }
  is_rent(agent:any){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/is_rent.php', agent,this.options);   
  }
  getAgentReport(lan) :Observable<Array<any>>{
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.get(this.apiRoot+'filter/get.php?lan='+lan, this.options).map(x=>x.json());
  }
  addMemberAndOrder(order){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.post(this.apiRoot+'order/add_member_and_order.php', order, this.options);  
  }
  set_payment_art_change(art:any) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'user/set_payment_art_change.php', art,this.options);     	    
  }
  loadFile(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data.file);
    formData.append("agent_id", data.agent_id);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'agreement/load_file.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  loadAgreement(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data.file);
    formData.append("agent_id", data.agent_id);
    formData.append("add_by", data.add_by);
    formData.append("title", data.title);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'agreement/load_agreement.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  deleteAgreement(id:number){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.delete(this.apiRoot+'user/delete_agreement.php?id='+id, this.options ); 
  }
  deleteNote(id:number){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    return this.http.delete(this.apiRoot+'user/delete_note.php?id='+id, this.options ); 
  }
}
