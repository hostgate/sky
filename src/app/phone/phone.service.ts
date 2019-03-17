import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Phone } from '../model/phone';
import 'rxjs';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';

@Injectable()
export class PhoneService {
  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
  }
  getPhones() :Observable<Array<Phone>>{
    return this.http.get(this.apiRoot+'phone/get.php',this.getOptions()).map(x=>x.json());
  }
  get(order:string,direction:string,page:number,search:string){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    let url=this.apiRoot+'phone/get_all.php?order='+order+'&direction='+direction+'&page='+page;
    if(search && search.length>0){
      url+='&search='+search;
    }
    return this.http.get(url, this.options).map(x=>x.json());
  }
  getExcel(search:string){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    this.tokenService.init();
    let url=this.apiRoot+'phone/get_excel.php';
    if(search && search.length>0){
      url+='?search='+search;
    }
    return this.http.get(url, this.options).map(x=>x.json());
  }
  getTrans() :Observable<Array<Phone>>{
    return this.http.get(this.apiRoot+'phone/get.php?trans=1', this.getOptions()).map(x=>x.json());
  }
  getAgentCompanyPhones(agent:number=0,company:number=0) :Observable<Array<Phone>>{
    return this.http.get(this.apiRoot+'phone/get.php?agent='+agent+'&company='+company,this.getOptions()).map(x=>x.json());
  }
  getNotUsedAgentCompanyPhones(agent:number=0,company:number=0,product:number=0) :Observable<Array<Phone>>{
    return this.http.get(this.apiRoot+'phone/get.php?used=0&agent='+agent+'&company='+company+'&product='+product, this.getOptions()).map(x=>x.json());
  }
  getUsedAgentCompanyPhones(agent:number=0,company:number=0) :Observable<Array<Phone>>{
    return this.http.get(this.apiRoot+'phone/get.php?used=1&agent='+agent+'&company='+company, this.getOptions()).map(x=>x.json());
  }
  getPhone(id) :Observable<Phone>{
    return this.http.get(this.apiRoot+'phone/get.php?id='+id, this.getOptions()).map(x=>x.json());
  }
  in_use(phone):Observable<any>{
    return this.http.get(this.apiRoot+'phone/get_in_use.php?phone='+phone, this.getOptions()).map(x=>x.json());
  }
  getPhoneLastOrder(id) :Observable<any>{
    return this.http.get(this.apiRoot+'phone/get_phone_last_order.php?id='+id, this.getOptions()).map(x=>x.json());
  }
  getSearch(search:string){
    return this.http.get(this.apiRoot+'phone/get.php?search='+search, this.getOptions()).distinctUntilChanged().debounceTime(50).filter(()=>search.length>2).map(x=>x.json());
  }
  add(phone:Phone[]) {
    return this.http.post(this.apiRoot+'phone/add.php', phone, this.getOptions());     	    
  }
  addExcel(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'phone/add_excel.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  addPhonesAndSimsExcel(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'phone/add_excel_phones_and_sims.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  addPhonesAndSimsExcel2(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'phone/add_excel_phones_and_sims2.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  addInternet(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'phone/add_internet.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  update(phone:Phone) {
    return this.http.put(this.apiRoot+'phone/edit.php', phone, this.getOptions());     	    
  }
  updateMobility(data) {
    return this.http.put(this.apiRoot+'phone/update_mobility.php', data, this.getOptions());     	    
  }
  confirm_trans(phone:Phone) {
    return this.http.put(this.apiRoot+'phone/confirm_trans.php', phone, this.getOptions());     	    
  }
  delete(id:number){
     return this.http.delete(this.apiRoot+'phone/delete.php?id='+id, this.getOptions() );  
  }
  getCountTransPhones():Observable<any>{
    return this.http.get(this.apiRoot+'notification/get_count_trans_phones.php', this.getOptions()).map(x=>x.json());
  }
  getOptions(){
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
   return  new RequestOptions({headers: headers});
  }
  getNewPhones(phone_id,agent_id){
    return this.http.get(this.apiRoot+'phone/get_new_phones.php?phone_id='+phone_id+'&agent_id='+agent_id, this.getOptions()).map(x=>x.json());
  }
  getNewSims(sim_id,agent_id){
    return this.http.get(this.apiRoot+'sim/get_new_sims.php?sim_id='+sim_id+'&agent_id='+agent_id, this.getOptions()).map(x=>x.json());
  }
  acceptNewPhone(old_phone,new_phone){
    return this.http.put(this.apiRoot+'phone/accept_new_phone.php', {old_phone:old_phone,new_phone:new_phone}, this.getOptions()); 
  }
  acceptNewSim(old_sim,new_sim){
    return this.http.put(this.apiRoot+'sim/accept_new_sim.php', {old_sim:old_sim,new_sim:new_sim}, this.getOptions()); 
  }
}
