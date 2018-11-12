import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { OrderService } from '../order.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { Order } from '../../model/order';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.css'],
  providers: [YnPipe],
})
export class CompleteComponent implements OnInit {
  loading:Boolean=false;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<CompleteComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private orderService:OrderService,
    public snackBar: MdSnackBar,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    private router:Router,
    public authService:AuthenticationService) {
     this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  complete(order:Order,tocomplete:string){
    this.data.loading=true;
    this.orderService.completed(order).subscribe(res=>{
      this.orderService.getCountNewOrders().subscribe(response=>{
        this.lsService.setStorage('count_new_orders',response,99999999999);
      });
      this.snackBar.open(order.id+'', tocomplete, {
        duration: 2000,
      });
      this.data.loading=false;
      if(this.data.url){
        let u:boolean=decodeURIComponent(this.data.url).indexOf('/מספר-טלפון') !== -1;
        if(u){
          this.router.navigate(['/מספר',this.data.phone_id]);
        }
        else{
          this.router.navigate(['/מספר-טלפון',this.data.phone_id]);
        }
      }
      else{
        this.router.navigate(['/הזמנות']);
      }
    });
  }

  ngOnInit() {
  }

}
