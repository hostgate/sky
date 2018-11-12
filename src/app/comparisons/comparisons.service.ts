import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs';
import * as AppConst from './../app.const'; 
import { Angular2TokenService } from 'angular2-token';
@Injectable()
export class ComparisonsService {

  http: Http;
  headers: Headers;
  options: RequestOptions;
  apiRoot:String=AppConst.API_ENDPOINT;
  constructor(private _http:Http,private tokenService: Angular2TokenService) { 
    this.http = _http;
  }
  uploadExcel(data:any) {
    let headers = this.tokenService.currentAuthHeaders;
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    formData.append("files", data);
    return this.tokenService.request({
      method: 'post',
      url: this.apiRoot+'phone/upload_excel.php',
      body: formData,
      headers: options.headers
    });    	    
  }
  disconnect_orders(orders:any[]) {
    let headers = new Headers({'Content-Type': 'application/json'});  
    let ls = localStorage.getItem('currentUser');
    let jls=JSON.parse(ls);
    let authToken=jls.token;
    headers.append('Authorization',`Bearer ${authToken}`)
    this.options = new RequestOptions({headers: headers});
    return this.http.put(this.apiRoot+'order/disconnect_orders.php', orders,this.options); 	    
  }
}
