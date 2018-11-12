import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MdSort, MdPaginator, MdDialog, MdPaginatorIntl } from '@angular/material';
import { PhoneService } from '../phone.service';
import { UsersService } from '../../users/users.service';
import { CompanyService } from '../../company/company.service';
import { ValidationService } from '../../validation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Phone } from '../../model/phone';
import { Company } from '../../model/company';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { Observable } from 'rxjs/Observable';
import { ConfirmTransComponent } from '../confirm-trans/confirm-trans.component';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-mobility-numbers',
  templateUrl: './mobility-numbers.component.html',
  styleUrls: ['./mobility-numbers.component.css'],
  providers: [ValidationService]
})
export class MobilityNumbersComponent implements OnInit {

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  lan:any
  constructor(
      private phoneService:PhoneService,
      private usersService:UsersService,
      public dialog: MdDialog,
      private companyService:CompanyService,
     // private productService:ProductService,
      private validationService:ValidationService,
      private formBuilder:FormBuilder,
      private mdPaginatorIntl:MdPaginatorIntl,
      private trans:TranslateService,
      private lsService:LocalStorageService,
      private excelService:ExcelService,
      public authService:AuthenticationService
    ) { 
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
      localStorage.setItem('currentComponent','app-mobility-numbers');
    }
    loadExcel(){
      let excel:any=[];
      this.dataSource.getFSData().forEach(el=>{
        let a:any={
          'id':el.id,
          'טלפון':el.phone,
          'מספר ניוד':el.moved_to_phone,
          'חברה':el.company_name,
          'ניוד בתאריך' :el.accepted_moved_to_phone==='1'?el.accepted_moved_date:'--'
  
        }
        excel.push(a);
      });
      this.excelService.exportAsExcelFile(excel, 'ניוד מספרים');
    }
  phones:Phone[];
  loading:Boolean=false;
  companies:Company[];
  //companyProducts:Product[];
  item:Phone;
  
  getCompanyName(id:number){
    if(id==0 || !this.companies){
      return '';
    }
    return this.companies.filter(
      company => company.id === id)[0].name;
  }
  
  ngOnInit() {
    this.loadCompanies();
    this.loadPhones();
  }
 
  public loadPhones(){
    this.phoneService.getTrans().subscribe(res=>{
      this.loading=false;
      if(!res['message']){
        this.phones = res.reverse();
        this.initPhoneDatabase();
      }
    });
  }
  loadCompanies(){
    this.companyService.getCompanys().subscribe(res=>{
        if(!res['message']){
          this.companies=res;
        }
    });
  }
 
  complete(phone:Phone){
    let dialogRef=this.dialog.open(ConfirmTransComponent,{
      width:'310px',
      data:{id:phone.id,phone:phone,data:this}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadPhones();
    });
  }
  displayedColumns = [ 'phone','moved_to_phone','agent_name','company_name','id'];
  phonesDatabase = new DB([]);
  dataSource: DS | null;
  initPhoneDatabase(){
    this.phonesDatabase = new DB(this.phones);
    this.dataSource = new DS(this.phonesDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }
}
