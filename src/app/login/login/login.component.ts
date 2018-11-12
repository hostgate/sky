import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors,NgForm } from "@angular/forms";
import { AuthenticationService } from '../authentication.service';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
//import {CookieService} from 'angular2-cookie/core';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    userfocus=false;
    passwordfocus=false;
    error = '';
    _login=true;
    lan:any;
    constructor(
        private router: Router,
        public authenticationService: AuthenticationService,private trans:TranslateService, private lsService:LocalStorageService
    /*private _cookieService:CookieService*/) { 
        this.lan='he';
        if(this.lsService.getStorage('lan')){
            this.lan=this.lsService.getStorage('lan');
        }
        this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
          this.lan=event.lang;
        });
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
       
    }
    _userfocus(){
        this.userfocus=true;
    }
    _userfocusout(){
        this.userfocus=false;
    }
    _passwordfocus(){
        this.passwordfocus=true;
    }
    _passwordfocusout(){
        this.passwordfocus=false;
    }
    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = 'שם המשתמש או הסיסמה שגויים!!';
                   
                    this.loading = false;
                }
            });
    }
    checkPass(e){
        if(this.model.password.length>4 && this.model.username!=''){
            this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if(result === true)
                this.login();
            });
        }
    }
    public  isloged(){
        return decodeURIComponent(this.router.url)!='/התחברות';
      }
}
