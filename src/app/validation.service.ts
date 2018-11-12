import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from "@angular/forms";
@Injectable()
export class ValidationService {
  constructor() { }
  legalPersonalId(control: FormControl): ValidationErrors{
    var tot = 0;
    let tz = control.value;
    for (let i = 0, len = 8; i < len; i++) {
      let x:any = (((i%2)+1)*tz.charAt(i));
      if (x > 9) {
        x=x.toString();
        x=parseInt(x.charAt(0))+parseInt(x.charAt(1))
      }
      tot += x;
    }
    if ((tot+parseInt(tz.charAt(8)))%10 == 0) {
      return null;
    } else {
      return {errorPersonalId:true};
    }
  }
  levelValidation(control: FormControl): ValidationErrors {
    let level_id=control.value;
    if(!level_id || ![1,2,3].includes(parseInt(level_id))){
       return {errorLevel:true};
    }
    return null;
  }
  emailValidation(control: FormControl): ValidationErrors {
    let email=control.value;
    let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      return {errorEmail:true};
    }
    return null;
  }
  autocompleteValidation(control: FormControl): ValidationErrors {
    if(!(typeof control.value==='object')){
      return {errorPhone:true};
    }
    return null;
  }
  phoneValidation(control: FormControl): ValidationErrors {
    let phone=control.value;
    let numbers: Array<string>=['0','1','2','3','4','5','6','7','8','9'];
    let preps: Array<string>=['050','052','053','054','055','057','058','077','074','072','02','03','04','08','09'];
    let p:string='';
    let prep:string='';
    for (let i = 0, len = phone.length; i < len; i++) {
      if(numbers.includes(phone[i])){
        p+=phone[i];
      }
    }
    if(p.length<9 || p.length>10){
      return {errorPhone:true};
    }
    else{
      prep=p[0]+p[1];
    }
    if(p.length==10){
      prep+=p[2];
    }
    if(!preps.includes(prep)){
      return {errorPhone:true};
    }
    return null;
  }
  numberValidation(control: FormControl): ValidationErrors {
    let number=control.value;
    
    if(number==''||isNaN(number)|| parseFloat(number)<0){
      return {numberError:true};
    }
    
    return null;
  }
  checkPassword(control: FormControl): ValidationErrors {
    let parent=control.parent;
    if(parent){
      let pass=parent.controls['password'].value;
      if(pass!=control.value) return {re_password:true};
    }
    
    return null;
  }
}
