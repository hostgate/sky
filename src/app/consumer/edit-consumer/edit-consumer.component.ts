import { Declaration } from '@angular/language-service';
import { Component, OnInit, ViewContainerRef, Output, Input } from '@angular/core';
import { User } from "../../model/user";
import { Consumer } from "../../model/consumer";
import { Level } from "../../model/level";
import { ConsumerService } from "../consumer.service";
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { ServerDateTime } from "../../model/server_date_time";
import { ValidationService } from "../../validation.service";
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-edit-consumer',
  templateUrl: './edit-consumer.component.html',
  styleUrls: ['./edit-consumer.component.css'],
  providers: [/*ServerDateTimeService,*/ValidationService]
})
export class EditConsumerComponent implements OnInit {
  lan:any;
  constructor(
    private route: ActivatedRoute,
    private consumerService:ConsumerService,
    private formBuilder: FormBuilder,
    private validationService:ValidationService,
    private router:Router,private trans:TranslateService, private lsService:LocalStorageService,
    public authService:AuthenticationService
  ) { 
    this.lan=this.lsService.getStorage('lan');
    this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lan=event.lang;
    });
    localStorage.setItem('currentComponent','app-edit-consumer');
  }
  id: number;
  consumer:Consumer;
  public loading:Boolean=true;
  private sub: any;
  consumerForm: FormGroup
  agents: User[];
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id =+params['id']; 
      this.loadData();
      this.loadAgents() ;
    });
  }
  loadAgents() {
    this.consumerService.getAgents().subscribe(res => {
      this.loading=false;
      this.agents = res.reverse();
    });
  }
  loadData() {
    this.consumerService.getConsumer(this.id).subscribe(res => {
      if(!res['message']) {
        this.consumer = res; 
        this.setForm(res) ;
      }
    });
  }
  public save(){
    this.consumerService.update(this.consumerForm.value).subscribe(res =>{
      this.leavePage();
    });
    
  }
  private setForm(consumer:Consumer) {
      this.consumerForm = this.formBuilder.group({
      id: [this.consumer.id],
      username: [consumer.email],
      email: [consumer.email],
      national_id:[consumer.national_id,this.validationService.legalPersonalId],
      firstname:[consumer.firstname, Validators.required],
      lastname:[consumer.lastname, Validators.required],
      phone:[consumer.phone,this.validationService.phoneValidation],
      mobile:[consumer.phone],
      birthday:[consumer.birthday],
      payment_methods:[consumer.payment_methods],
      level_id:[4],
      parent: [consumer.parent, Validators.required],
    });
  }
  private leavePage(){
    this.router.navigate(['/לקוחות']);
  }
}
