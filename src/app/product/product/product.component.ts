import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ValidationService } from "../../validation.service";
import { Product  } from "../../model/product";
import { FormControl, Validators, FormBuilder, FormGroup, NgModel, ValidationErrors } from "@angular/forms";
import { ProductService } from "../product.service";
import { CompanyService } from "../../company/company.service";
import { Router } from '@angular/router';
import { Company } from "../../model/company";
import { MdDialog, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdSort, MdPaginator, MdPaginatorIntl } from '@angular/material';
import { AddProductComponent } from "../add-product/add-product.component";
import { EditProductComponent } from '../edit-product/edit-product.component';
import { YnPipe } from '../../pipes/yn.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { DB } from '../../database/db';
import { DS } from '../../datasource/ds';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { ExcelService } from '../../excel.service';
import { AuthenticationService } from '../../login/authentication.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ValidationService]
})
export class ProductComponent implements OnInit {
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('fileInput') fileInput;
  products:Product[];
  companies:Company[]
  item:Product;
  name: string;
  private sTimeout;
  editRowId:number=0;
  toggleEdit(id){
    this.editRowId = id;
  }
  public loading:Boolean=true;
  searchForm: FormGroup;
  productForm:FormGroup;
  selectedValue:number;
  private setForm() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }
  clear() {
  }
  timeoutMSG() { 
    setTimeout(() => {
      this.clear();
    }, 7000);
  } 
  lan:any;
  constructor(
      private productService:ProductService,
      private companyService:CompanyService,
      private formBuilder: FormBuilder,
      private validationService:ValidationService,
      public dialog: MdDialog,
      private router:Router,private mdPaginatorIntl:MdPaginatorIntl,
     private trans:TranslateService,
      private lsService:LocalStorageService,
      private excelService:ExcelService,
      public authService:AuthenticationService) { 
        this.products = new Array<Product>();
        this.companies = new Array<Company>();
        this.timeoutMSG(); 
        this.companyService.getCompanys().subscribe(res => {
          this.loading=false;
           if(!res['message']) {
           this.companies = res;
           }
         });
         this.lan=this.lsService.getStorage('lan');
         this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
           this.lan=event.lang;
         });
         localStorage.setItem('currentComponent','app-product');
      }
      loadExcel(){
        let excel:any=[];
        this.dataSource.getFSData().forEach(el=>{
          let a:any={
            'id':el.id,
            'חברה':el.company_name,
            'שם':el.name,
            'תיאור':el.description,
            'מחיר':el.price,
            'תקופה':''+ el.days_or_months_numbers +' '+(el.days_or_months==='months'?'חודשים':'ימים')
          }
          excel.push(a);
        });
        this.excelService.exportAsExcelFile(excel, 'חבילות');
      }
      onChangeEvent({target}){
        this.name = target.value;
      }
      // greetMe(id:number){
        
      //   let name=this.products.filter(item => item['id']==id)[0].name;
      //   this.confirmationService.confirm({
      //   message: `למחוק חבילה ${name} `,
      //   header: 'מחיקה!!',
      //   icon: 'fa fa-question-circle',
      //   accept: () => {
      //     this.delete(id);
      //   },
      //   reject: () => {}
      //   });
      // }
      getLastId(){
        if(this.products.length==0) return 0;
        return this.products[this.products.length-1].id;
      }
      getCompanyName(id:number){
        let companies:Company[]=this.companies.filter(item => item['id']==id);
        return companies.length>0 && companies[0].name;
      }
      refresh(): void {
          this.editRowId=0;
          this.loadData();
      }
      loadData() {
        this.productService.getProducts().subscribe(res => {
           this.loading=false;
            if(!res['message']) {
            this.products = res.reverse();
            this.initProductDatabase();
            }
          });
          this.companyService.getCompanys().subscribe(res => {
            this.loading=false;
             if(!res['message']) {
             this.companies = res.reverse();
             }
           });
          
      }
      loadSearchData(search) {
        this.productService.getSearch(search).subscribe(res => {
            this.loading=false;
            if(!res['message']) {
              this.products = res.reverse();
            }
            else{
              this.products=[];
            }
          });
      }
      search(){
        let search:string=this.searchForm.value.search;
        if(search!=''){
          this.loadSearchData(search);
        }
        else{
          this.loadData();
        }
      }
      openAddDialog(): void {
        let dialogRef = this.dialog.open(AddProductComponent, {
          width: '310px',
          data: { product:this}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
      openEditDialog(id:number): void {
        this.setProductForm(id) ;
        let dialogRef = this.dialog.open(EditProductComponent, {
          width: '310px',
          data: { product:this,id:id}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }
      br2nl(str) {
        return str;//.replace(/<br\s*[\/]?>/gi, "\n");//.replace(/<br ?\/?>/g, "\n");
    }
      getTheCompany(row){
        let c=row.company_name;
        if(this.lan!='he'){
          if(this.lan=='ar'){
            if(row.company_name_ar!=''){
              c=row.company_name_ar;
            }
          }
          else{
            if(row.company_name_en!=''){
              c=row.company_name_en;
            }
          }
        }
        return c;
      }
      getProductName(row){
        let c=row.name;
        if(this.lan!='he'){
          if(this.lan=='ar'){
            if(row.name_ar!=''){
              c=row.name_ar;
            }
          }
          else{
            if(row.name_en!=''){
              c=row.name_en;
            }
          }
        }
        return c;
      }
      getProductDescription(row){
        let c=row.description;
        if(this.lan!='he'){
          if(this.lan=='ar'){
            if(row.description_ar!=''){
              c=row.description_ar;
            }
          }
          else{
            if(row.description_en!=''){
              c=row.description_en;
            }
          }
        }
        return c;
      }
      ngOnInit() {
        this.editRowId=0;
        this.item = {
          id: null,
          name: '',
          name_ar:'',
          name_en:'',
          description:'',
          description_ar:'',
          description_en:'',
          price:null,
          created_at: '',
          created_at_sec: '',
          last_update: '',
          last_update_sec: '',
          company_id: 0,
          company_name:'',
          company_name_ar:'',
          company_name_en:'',
          level_id:0,
          active:true,
          days_or_months:'months',
          days_or_months_numbers:1,
        };
        this.setProductForm();
        this.setForm();
        this.loadData();
      }
      active(product){
        this.productService._active(product).subscribe(res=>{
          this.ngOnInit();
        });
      }
      private setProductForm(id:number=0) {
        if(id>0){
            this.productService.getProduct(id).subscribe(res => {
              this.loading=false;
              if(!res['message']) {
                this.item.name=res.name;
                this.item.description=res.description;
                this.item.name_ar=res.name_ar;
                this.item.name_en=res.name_en;
                this.item.description_ar=res.description_ar;
                this.item.description_en=res.description_en;
                this.item.price=res.price;
                this.item.company_id=res.company_id;
                this.item.days_or_months=res.days_or_months;
                this.item.days_or_months_numbers=res.days_or_months_numbers;
                this.productForm = this.formBuilder.group({
                  name: [this.item.name, Validators.required],
                  name_ar: [this.item.name_ar],
                  name_en: [this.item.name_en],
                  description: [this.br2nl(this.item.description)],
                  description_ar: [this.br2nl(this.item.description_ar)],
                  description_en: [this.br2nl(this.item.description_en)],
                  price:[this.item.price, Validators.required],
                  company_id: [this.item.company_id,  Validators.required],
                  days_or_months: [this.item.days_or_months,  Validators.required],
                  days_or_months_numbers: [this.item.days_or_months_numbers,  Validators.required],
                });
              }
            });
        }
        else{
          this.productForm = this.formBuilder.group({
            name: [this.item.name, Validators.required],
            name_ar: [this.item.name_ar],
            name_en: [this.item.name_en],
            description: [this.br2nl(this.item.description)],
            description_ar: [this.br2nl(this.item.description_ar)],
            description_en: [this.br2nl(this.item.description_en)],
            price:[this.item.price, Validators.required],
            company_id: [this.item.company_id,  Validators.required],
            days_or_months: [this.item.days_or_months,  Validators.required],
            days_or_months_numbers: [this.item.days_or_months_numbers,  Validators.required],
          });
        }
        
        
      }
     
      public restProductForm(){
        this.item = {
          id: null,
          name: '',
          name_ar: '',
          name_en: '',
          description:'',
          description_ar:'',
          description_en:'',
          price:null,
          created_at: '',
          created_at_sec: '',
          last_update: '',
          last_update_sec: '',
          company_id: 0,
          company_name:'',
          company_name_ar:'',
          company_name_en:'',
          level_id:0,
          active:true,
          days_or_months:'months',
          days_or_months_numbers:0
        };
        this.productForm = this.formBuilder.group({
          name: [this.item.name, Validators.required],
          name_ar: [this.item.name_ar],
          name_en: [this.item.name_en],
          description: [this.br2nl(this.item.description)],
          description_ar: [this.br2nl(this.item.description_ar)],
          description_en: [this.br2nl(this.item.description_en)],
          price:[this.item.price, Validators.required],
          company_id: [this.item.company_id,  Validators.required],
          days_or_months: [this.item.days_or_months,  Validators.required],
          days_or_months_numbers: [this.item.days_or_months_numbers,  Validators.required],
        });
      }
      compareById(obj1, obj2) {
        return obj1.id === obj2.id;
     }
     delete(id:number){
      let dialogRef=this.dialog.open(DeleteDialog,{
        width:'310px',
        data:{ id: id,product:this.products.filter(product=> product.id==id)[0].name,data:this }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.loadData();
      });
    }
    displayedColumns = [ 'name','description','price','days_or_months','company_name','id'];
    productsDatabase = new DB([]);
    dataSource: DS | null;
    initProductDatabase(){
      this.productsDatabase = new DB(this.products);
      this.dataSource = new DS(this.productsDatabase, this.sort, this.paginator);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  providers: [YnPipe],
})
export class DeleteDialog {
  constructor(
    public dialogRef: MdDialogRef<DeleteDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private productService:ProductService,
    public snackBar: MdSnackBar,
    private authService:AuthenticationService) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  delete(id:number,todelete:string){
    this.data.loading=true;
    this.productService.delete(id).subscribe(res=>{
      this.snackBar.open(this.data.product, todelete, {
        duration: 2000,
      });
      this.data.loading=false;
    });
  }
}