import { Component, Inject, OnInit, ElementRef, ViewChild, Input,NgModule } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { User } from '../../model/user';
import { GlobalDiscountService } from '../global-discount.service';
import { ProductService } from '../../product/product.service';
import { Product } from '../../model/product';
import { FormControl, Validators, FormBuilder, FormGroup ,NgModel} from '@angular/forms';
import { MdAutocompleteModule,MdSort,MdPaginator,MdPaginatorIntl} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import { AgentDiscount } from '../../model/agent_discount';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { ValidationService } from '../../validation.service';
import { TranslateService, LangChangeEvent, TranslationChangeEvent } from 'ng2-translate';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { CompanyService } from '../../company/company.service';
import { Company } from '../../model/company';
import { YnPipe } from '../../pipes/yn.pipe';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-global-discount',
  templateUrl: './global-discount.component.html',
  styleUrls: ['./global-discount.component.css'],
  providers: [ValidationService,YnPipe]
})
export class GlobalDiscountComponent implements OnInit {
 
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  lan:any;
  constructor(private userService:UsersService,
              private globalDiscount:GlobalDiscountService,
              private companyService:CompanyService,
              private productService:ProductService,
              private validationService:ValidationService,
              private formBuilder:FormBuilder,
              public dialog: MdDialog,
              private mdPaginatorIntl:MdPaginatorIntl,
              private translate: TranslateService,
              private lsService:LocalStorageService,
              private excelService:ExcelService,
              public authService:AuthenticationService) {
               this.lan=this.lsService.getStorage('lan');
               this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
                this.lan=event.lang;
              });
    this.selectedProduct=null;
    this.selectedDiscounts=[];
    localStorage.setItem('currentComponent','app-global-discount');
  }
  loadExcel(){
    let excel:any=[];
    this.dataSource.getFSData().forEach(el=>{
      let a:any={
        'סוכן':el.username,
        'חבילה':el.product_name,
        'מחיר':this.selectedProduct.price,
        'הנחה':(el.discount.toFixed(2))+' % / '+(0.01*el.discount*this.selectedProduct.price)+' ש"ח'
      }
      excel.push(a);
    });
    this.excelService.exportAsExcelFile(excel, 'הנחות');
  }
  openEditDialog(agent_id:any): void {
   let agent_discount:AgentDiscount[]= this.discounts.filter(discount =>
      discount.user_id===parseInt(agent_id));
    let value:number=0;
    if(agent_discount && agent_discount[0]){
      value=agent_discount[0].discount;
    }
    this.discountForm = this.formBuilder.group({
      discount: [value,Validators.compose([ Validators.required])]
    });
    let dialogRef = this.dialog.open(EditDiscount, {
      width: '250px',
      data: { agent_discount: {discount:value,user_id:agent_id,product_id:this.selectedProduct.id},discountForm:this.discountForm,data:this,price:this.selectedProduct.price }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openAddAllDialog(name,company_name): void {
   
     this.discountForm = this.formBuilder.group({
       discount: [0,Validators.compose([ Validators.required])]
     });
     let dialogRef = this.dialog.open(AddAllDiscount, {
       width: '250px',
       data: { agent_discount: {discount:0,user_id:0,product_id:this.selectedProduct.id},discountForm:this.discountForm,data:this,
       price:this.selectedProduct.price,name:name,company_name:company_name }
     });
     dialogRef.afterClosed().subscribe(result => {
     });
   }

  companies:Company[];
  agents:User[];
  products:Product[]=null;
  selectedProduct:Product;
  selectedDiscounts:any[];
  loading:Boolean=true;
  discounts:AgentDiscount[];
  myControl: FormControl = new FormControl();
  discountForm:FormGroup;
  agent_product_discount:any[];
  filteredOptions: Observable<Product[]>;
  _filter(val: string): Product[] {
    return this.products.filter(option =>
      option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  displayFn(product:Product): string {
    return product ? product.name :'';
  }
  empty() {
    this.myControl.setValue('');
  }
  changeProduct(event: any) {
    if(event && event.id){
      this.loading=true;
      this.globalDiscount.getDiscounts(event.id).subscribe(res=>{
        if(!res['message']) {
          this.discounts = res.reverse();
        }
        else{
          this.discounts = [];
        }
      });
      this.selectedProduct=event;
      this.selectedProduct.company_name_ar=this.companies.filter(el=>el.id==this.selectedProduct.company_id)[0].name_ar;
      this.selectedProduct.company_name_en=this.companies.filter(el=>el.id==this.selectedProduct.company_id)[0].name_en;
      this.selectedDiscounts=[];
      this.loading=true;
      window.setTimeout(()=>{
      this.loading=false;
        this.agents.forEach(
          element=>{
              let item:any={'user_id':0,'username':'','discount':0,'product_id':0,'product_name':''};
              item.user_id=element.id;
              item.username=element._username;
              item.product_id=event.id;
              item.product_name=event.name;
              item.product_name_ar=event.name_ar;
              item.product_name_en=event.name_en;
              let filer_discounts=this.agentHasDiscount(parseInt(item.user_id),this.discounts);
              if(filer_discounts && filer_discounts.length>0){
                item.discount=filer_discounts[0].discount;
              }
              else{
                item.discount=0;
              }
              this.selectedDiscounts.push(item);
          }
        );
        this.initDiscountDatabase();
      }, 1000);
    }
    else{
      this.selectedProduct=null;
      this.selectedDiscounts=[];
    }
    
  }
  displayedColumns = ['username', 'product_name','discount' ,'user_id'];
  discountDatabase = new DB([]);
  dataSource: DS | null;
 
  initDiscountDatabase(){
    this.discountDatabase = new DB(this.selectedDiscounts);
    this.dataSource = new DS(this.discountDatabase, this.sort, this.paginator);
   // console.log(this.dataSource );
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
   
  }
  private agentHasDiscount(agent_id,discounts):any{
    if(!discounts) return false;
    return discounts.filter(discount =>
      discount.user_id===agent_id);
  }
  private loadData(){
    if(this.selectedCompany!==null){
     this.productService.getCompanyProducts(this.selectedCompany).subscribe(res => {
      this.loading=false;
       if(!res['message']) {
       this.products = res.reverse();
       
       this.filteredOptions = this.myControl.valueChanges
       .startWith(null)
       .map(product => product && typeof product === 'object' ? product.name : product)
       .map(name => name ? this._filter(name) : this.products.slice());
       }
     });
    }
    this.userService.getAgents().subscribe(res=> {
      this.loading=false;
       if(!res['message']) {
          this.agents = res.reverse();
       }
     });
     this.companyService.getCompanys().subscribe(res=> {
      this.loading=false;
      if(!res['message']) {
          this.companies = res;
      }
     });
 }
  ngOnInit() {
    this.loadData();
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.mdPaginatorIntl.itemsPerPageLabel=event.translations.number_of_page;
    });
  }
  loadDiscount(agent_discount:AgentDiscount){
    for(let i=0;i<this.selectedDiscounts.length;i++){
      if(parseInt(this.selectedDiscounts[i].user_id)==agent_discount.user_id ){
        this.selectedDiscounts[i].discount=agent_discount.discount;
      }
    }
  }
  clear() {
  }
  selectedCompany:number=null;
  changeCompany(e){
    this.empty();
    this.products=[];
    this.selectedProduct=null;
    this.selectedDiscounts=[];
    this.selectedCompany=e.value;
    this.productService.getCompanyProducts(this.selectedCompany).subscribe(res => {
      this.loading=false;
       if(!res['message']) {
       this.products = res.reverse();
       this.filteredOptions = this.myControl.valueChanges
       .startWith(null)
       .map(product => product && typeof product === 'object' ? product.name : product)
       .map(name => name ? this._filter(name) : this.products.slice());
       }
     });
  }
  fixed2(x:number){
    return x.toFixed(2);
  }
}
@Component({
  selector: 'edit-discount',
  templateUrl: 'edit-discount.html',
  providers: [ValidationService]
})
export class EditDiscount {
  discount_art:string='discount_prozent';
  pro=true;
  constructor(
    public dialogRef: MdDialogRef<EditDiscount>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private globalDiscount:GlobalDiscountService,
    private authService:AuthenticationService) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(new_discount:any,agent_discount:AgentDiscount){
    if(this.pro){
      agent_discount.discount=new_discount;
    }
    else{
      agent_discount.discount=(100.0*new_discount)/this.data.price;
    }
    this.data.data.loading=true;
    this.globalDiscount.update(agent_discount).subscribe(res => {
      this.data.data.loading=false;
      this.data.data.changeProduct({'id':agent_discount.product_id,'price':this.data.price});
    });
    this.dialogRef.close();
  }
  changeDiscount(){
   
   if(this.pro){
     this.discount_art='discount_shekel';
     this.data.discountForm.patchValue({
      discount: ((0.01*this.data.agent_discount.discount)*this.data.price).toFixed(2)
    });
   }
   else{
    this.discount_art='discount_prozent';
    this.data.discountForm.patchValue({
      discount:this.data.agent_discount.discount
    });
   }
  }
}

@Component({
  selector: 'edit-discount',
  templateUrl: 'edit-discount.html',
  providers: [ValidationService]
})
export class AddAllDiscount {
  discount_art:string='discount_prozent';
  pro=true;
  constructor(
    public dialogRef: MdDialogRef<EditDiscount>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private globalDiscount:GlobalDiscountService,
    public authService:AuthenticationService) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  save(new_discount:any,agent_discount:AgentDiscount){
    if(this.pro){
      agent_discount.discount=new_discount;
    }
    else{
      agent_discount.discount=(100.0*new_discount)/this.data.price;
    }
    //console.log('new_discount',new_discount);
    //console.log('agent_discount',agent_discount);
    this.data.data.loading=true;
    this.globalDiscount.update(agent_discount).subscribe(res => {
      this.data.data.loading=false;
      this.data.data.changeProduct({'id':agent_discount.product_id,'price':this.data.price,'name':this.data.name,'company_name':this.data.company_name});
    });
    this.dialogRef.close();
  }
  changeDiscount(){
   
   if(this.pro){
     this.discount_art='discount_shekel';
     this.data.discountForm.patchValue({
      discount: ((0.01*this.data.agent_discount.discount)*this.data.price).toFixed(2)
    });
   }
   else{
    this.discount_art='discount_prozent';
    this.data.discountForm.patchValue({
      discount:this.data.agent_discount.discount
    });
   }
  }
}