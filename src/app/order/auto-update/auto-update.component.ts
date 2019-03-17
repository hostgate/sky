import { Component, OnInit, ViewChild } from '@angular/core';
import { PhoneService } from '../../phone/phone.service';
import { AuthenticationService } from '../../login/authentication.service';
import { OrderService } from '../order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-update',
  templateUrl: './auto-update.component.html',
  styleUrls: ['./auto-update.component.css']
})
export class AutoUpdateComponent implements OnInit {
  loading:Boolean=false;
  constructor(private phoneService:PhoneService,
              public authService:AuthenticationService,
              private orderService:OrderService,
              private router: Router,) { }
  @ViewChild('fileInput') fileInput;
  ngOnInit() {}
  excelPhones=[];
  out:any=null;
  months=[];
  excelPhonesAndMonths=[];
  upload() {
    this.loading=true;
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.phoneService.addExcel(fileBrowser.files[0]).subscribe(
        res=>{
          if(res['_body'] ){
            let r=JSON.parse(res['_body']);
            this.excelPhones=r.data.map(el=>el[0]).filter((x, i, a) => x && a.indexOf(x) === i);
            this.months=r.data.map(el=>(el && el[1])?el[1]:0);//.filter((x, i, a) => x && a.indexOf(x) === i);
            let i=0;
            this.excelPhones.forEach(el=>{
              this.excelPhonesAndMonths.push([this.excelPhones[i],this.months[i]]);
              i++;
            });
            console.log(this.excelPhonesAndMonths);
           // this.excelPhones=r.data.map(el=>(el && el[0] && el[1])?[el[0],el[1]]:el[0]).filter((x, i, a) => x && ((a && a[0] && a[1])?a[0]:a).indexOf(x) === i);
            this.loading=false;
         //   this.formOnInit({});
          //  this.openAddDialog();
          }
      });
    }
  }
  update(){
    if(confirm("חידוש אוטומאטי לכל המספרים!!")) {
      this.loading=true;
      this.orderService.automatic_to_list(this.excelPhones).subscribe(res=>{
        this.loading=false;
        this.router.navigate(['/הזמנות']);
      // this.out=res;
      });
    }
  }
  cancel_update(){
    if(confirm("ביטול חידוש אוטומאטי לכל המספרים!!")) {
      this.loading=true;
      this.orderService.cancel_automatic_to_list(this.excelPhones).subscribe(res=>{
        this.loading=false;
        this.router.navigate(['/הזמנות']);
      // this.out=res;
      });
    }
  }
}
