import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';

@Component({
  selector: 'valid-err',
  templateUrl: './valid-err.component.html',
  styleUrls: ['./valid-err.component.css']
})
export class ValidErrComponent implements OnInit {

 @Input('control')
  formControl: FormControl;

  getErrors() {
    let errors: Array<string> = [];
    for (var key in this.formControl.errors) {
      if (this.formControl.errors.hasOwnProperty(key) && (this.formControl.value || this.formControl.touched)) {
      errors.push(this.getErrorMessage(key, this.formControl.errors[key]));
       }
    }
    return errors;
  }

  getErrorMessage(key: string, value: any): string {
    return key;

  }
  lan:any;
  constructor(private trans:TranslateService,
    private lsService:LocalStorageService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    
   }

  ngOnInit() {
  }

}
