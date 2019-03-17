import { Declaration } from '@angular/language-service';
import { Component, OnInit, ViewContainerRef, Output, Input } from '@angular/core';
import { Consumer } from "../../model/consumer";
import { User } from "../../model/user";
import { Level } from "../../model/level";
import { ConsumerService } from "../consumer.service";
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { ValidationService } from "../../validation.service";
import { Router } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-add-consumer',
  templateUrl: './add-consumer.component.html',
  styleUrls: ['./add-consumer.component.css'],
  providers: [ValidationService]
})
export class AddConsumerComponent implements OnInit {
  startDate = new Date(1980, 0, 1);
  item: Consumer;
  consumerForm: FormGroup;
  agents: User[]=[];
  lan:any;
  loadAgents() {
    this.consumerService.getAgents().subscribe(res => {
        this.agents = res.reverse();
      });
  }
  constructor(
    private formBuilder: FormBuilder,
    private consumerService:ConsumerService,
    private validationService:ValidationService,
    private router:Router,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-add-consumer');
  }
  save() {
    let id = this.item.id;
    this.item = this.consumerForm.value;
    this.item.username=this.item.email;
    this.item.mobile=this.item.phone;
    this.consumerService.add(this.item).subscribe(res => { 
      this.leavePage();
    });
  }
  private leavePage(){
    this.router.navigate(['/לקוחות']);
  }
  private setForm() {
    this.consumerForm = this.formBuilder.group({
      username: [this.item.email],
      parent: [this.authService.isAgent()?""+this.authService.getCurrentUser().id:null, Validators.required],
      email: [this.item.email],
      national_id:[this.item.national_id,this.validationService.legalPersonalId],
      firstname:[this.item.firstname, Validators.required],
      lastname:[this.item.lastname, Validators.required],
      phone:[this.item.phone,this.validationService.phoneValidation],
      mobile:[this.item.phone],
      birthday:[this.item.birthday],
      payment_methods:[this.item.payment_methods],
      level_id:[4]
    });
  }
  ngOnInit() {
    this.loadAgents() ;
    this.item = {
        id: null,
        username: '',
        email: '',
        national_id: '',
        firstname: '',
        lastname: '',
        phone: '',
        mobile: '',
        birthday: '',
        birthday_sec: '',
        created_at: '',
        created_at_sec: '',
        last_update: '',
        last_update_sec: '',
        level_id: 4,
        parent:null,
        parent_name:'',
        payment_methods:''
      };
     this.setForm();
  }
}
