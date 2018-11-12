import { Declaration } from '@angular/language-service';
import { Component, OnInit, ViewContainerRef, Output, Input } from '@angular/core';
import { User } from "../../model/user";
import { Level } from "../../model/level";
import { UsersService } from "../users.service";
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { ServerDateTime } from "../../model/server_date_time";
import { ValidationService } from "../../validation.service";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { MatSnackBar } from '@angular/material';
import { MsgComponent } from '../../msg/msg.component';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [ValidationService]
})
export class EditUserComponent implements OnInit {
  lan:any;
  constructor(
    private route: ActivatedRoute,
    private userService:UsersService,
    private formBuilder: FormBuilder,
    private validationService:ValidationService,
    private router:Router,private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    public snackBar: MatSnackBar
  ) { 
    this.lan=this.lsService.getStorage('lan');
  this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
    this.lan=event.lang;
  });}
  id: number;
  user:User;
  showPwd:Boolean=false;
  public loading:Boolean=true;
  private sub: any;
  userForm: FormGroup
  userLevels: Level[]=[];
  agents: User[]=JSON.parse('[{"id":"3","username":"consumer1","password":"********","email":"consumer1@gmail.com","national_id":"040515280","firstname":"\u05e1\u05d5\u05db\u05df 1","lastname":"\u05e1\u05d5\u05db\u05df 1","phone":"04040404","mobile":"0526156970","parent":"2","created_at":"2017-08-08 12:49:47","created_at_sec":"1502185787","last_update":"2017-08-21 13:45:32","last_update_sec":"1502185787","level_id":"3"},{"id":"51","username":"agent2","password":"********","email":"sad@sdad.we","national_id":"040515280","firstname":"agent2","lastname":"agent2","phone":"0541236452","mobile":"0541236452","parent":"0","created_at":"2017-08-21 15:34:39","created_at_sec":"1503318880","last_update":"2017-08-21 15:34:39","last_update_sec":"1503318880","level_id":"3"}]');
  
  ngOnInit() {
   
    this.sub = this.route.params.subscribe(params => {
      this.id =+params['id']; 
   });
   this.loadLevels() ;
   this.loadData();
  }
  togglePWD(){
    this.showPwd=!this.showPwd;
    if(this.showPwd){
      this.userForm = this.formBuilder.group({
        id: [this.user.id],
        username: [this.userForm.value.username, Validators.required],
        password_requied:[null],
        password: ['', Validators.required],
        re_password:['',Validators.compose([ Validators.required,this.validationService.checkPassword])],
        email: [this.userForm.value.email, this.validationService.emailValidation],
        national_id:[this.userForm.value.national_id,this.validationService.legalPersonalId],
        firstname:[this.userForm.value.firstname],
        lastname:[this.userForm.value.lastname],
        phone:[this.userForm.value.phone],
        address:[this.userForm.value.address],
        mobile:[this.userForm.value.mobile,this.validationService.phoneValidation],
        birthday:[this.userForm.value.birthday],
        level_id:[this.userForm.value.level_id,this.validationService.levelValidation]
      });
    }
    else{
      this.userForm = this.formBuilder.group({
        id: [this.user.id],
        username: [this.userForm.value.username, Validators.required],
        password_requied:[null],
        password: [''],
        re_password:[''],
        email: [this.userForm.value.email, this.validationService.emailValidation],
        national_id:[this.userForm.value.national_id,this.validationService.legalPersonalId],
        firstname:[this.userForm.value.firstname],
        lastname:[this.userForm.value.lastname],
        phone:[this.userForm.value.phone],
        address:[this.userForm.value.address],
        mobile:[this.userForm.value.mobile,this.validationService.phoneValidation],
        birthday:[this.userForm.value.birthday],
        level_id:[this.userForm.value.level_id,this.validationService.levelValidation]
      });
    }
    
  }
  loadLevels() {
    this.userService.getUserLevels().subscribe(res => {
       
        this.userLevels = res.reverse();
      
      });
    /*this.userService.getAgents().subscribe(res => {
       
        this.agents = res.reverse();
      
      });*/
  }
  loadData() {
    this.userService.getUser(this.id).subscribe(res => {
        if(!res['message']) {
            this.loading=false;
        this.user = res; 
        this.setForm(res) ;
      }
      });
     
  }
  public save(){
    this.userService.update(this.userForm.value).subscribe(res => { });
    
    this.userForm.value.username='';
   // this.msgs.push({severity:'success', summary:'נשמר בהצלחה', detail:this.userForm.value +' נשמר '});
    this.snackBar.openFromComponent(MsgComponent,{
      duration: 3000,
      horizontalPosition:'right',
      data:{title:'נשמר בהצלחה',detail:this.userForm.value +' נשמר ',art:'add',place:'user'}
    });
    this.router.navigate(['/']);

  }
  iam=false;
  private setForm(user:User) {
      this.userForm = this.formBuilder.group({
      id: [this.user.id],
      username: [user.username, Validators.required],
      password_requied:[null,],
      password: [''],
      re_password:['',this.validationService.checkPassword],
      email: [user.email, this.validationService.emailValidation],
      national_id:[user.national_id,this.validationService.legalPersonalId],
      firstname:[user.firstname],
      lastname:[user.lastname],
      phone:[user.phone],
      address:[user.address],
      mobile:[user.mobile,this.validationService.phoneValidation],
      birthday:[user.birthday],
      level_id:[user.level_id,this.validationService.levelValidation]
    });
    this.iam=this.authService.getCurrentUserId()==this.user.id;
  }
  
}
