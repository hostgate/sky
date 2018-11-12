import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import * as AppConst from './../app.const'; 
import { LocalStorageService } from "../local-storage.service";
import { JwtHelper } from 'angular2-jwt';
import { Angular2TokenService } from 'angular2-token';
@Injectable()
export class AuthenticationService {
   public token: string;
    apiRoot:String=AppConst.API_ENDPOINT;
    expires:number=3600;
    rent='0';
    change_price='0';
    block_my_members='0';
    is_default='0';
    allow_account_exception='0';
    receiving_messages='0'; 
    constructor(private http: Http,private lsService:LocalStorageService,private jwt:JwtHelper,private tokenService:Angular2TokenService) {
     this.getSessionTime().subscribe(res=>{
         this.expires=parseInt(res);
     });
    }
    getSessionTime(): Observable<any> {
        return this.http.get(this.apiRoot+'settings/get_session_time.php').map(x=>x.json());
    }
    login(username: string, password: string): Observable<boolean> {
        let headers = new Headers({'Content-Type': 'application/json'});  
        headers.append('Authorization','Bearer ')
        let options = new RequestOptions({headers: headers});
        return this.http.post(
            this.apiRoot+'authenticate.php', 
            JSON.stringify({ username: username, password: password ,login:'login'}),
            options)
            .map((response: Response) => {
                if(response && !response['_body']){
                    return false;
                }
                let _body=JSON.parse(response['_body']); 
                let token = _body && _body.token;
                if (token) {
                    this.token = token;
                    let userInfo=this.jwt.decodeToken(this.token ).data;
                    //console.log(userInfo);
                    this.rent=userInfo.rent;
                    this.change_price=userInfo.change_price;
                    this.block_my_members=userInfo.block_my_members;
                    this.is_default=userInfo.is_default;
                    this.allow_account_exception=userInfo.allow_account_exception;
                    this.receiving_messages=userInfo.receiving_messages;
                    this.lsService.setStorage('currentUser', JSON.stringify({ username: username, token: token }),this.expires);
                    this.lsService.setStorage('userInfo',JSON.stringify(userInfo),this.expires);
                    return true;
                } else {
                    return false;
                }
            });
    }
    public isAdmin(): Observable<boolean> | Promise<boolean> | boolean{
            return 1==this.getCurrentUserLevel();
    }
    public isWorker(): Observable<boolean> | Promise<boolean> | boolean{
            return 2==this.getCurrentUserLevel();
    }
    public canUpdate(): Observable<boolean> | Promise<boolean> | boolean{
        return this.isAdmin() || this.isWorker();
    }
    public isAgent(): Observable<boolean> | Promise<boolean> | boolean{
        return 3==this.getCurrentUserLevel();
    }
    public isRent(): Observable<boolean> | Promise<boolean> | boolean{
        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return this.canUpdate()||userInfo.rent=='1';
    }
    public canChangePrice(): Observable<boolean> | Promise<boolean> | boolean{
        return this.canUpdate() || (this.isAgent() && this.change_price=='1');
    }
    public canBlockMembers(): Observable<boolean> | Promise<boolean> | boolean{
        return  (this.isAgent() && this.block_my_members=='1');
    }
    public receivingMassges(): Observable<boolean> | Promise<boolean> | boolean{
        return  (this.isAgent() && this.receiving_messages=='1');
    }
    public belongsToUser(agent): Observable<boolean> | Promise<boolean> | boolean{
        return this.canUpdate() ||(this.isAgent()&& parseInt(agent)==parseInt(this.getCurrentUserId()));
    }
    public getCurrentUser(){
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        if(this.token){
            return this.jwt.decodeToken(this.token ).data;
        }
        return false;
    }
    public getCurrentUserLevel(){
        return this.getCurrentUser().level_id;
    }
    public getCurrentUserId(){
        return this.getCurrentUser().id;
    }
    logout(): void {
        this.tokenService.init();
        this.token = null;
        this.lsService.removeStorage('currentUser');
        this.lsService.removeStorage('userInfo');
        this.lsService.removeStorage('excelPhones');
    }
}