import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { Phone } from '../../model/phone';
import { PhoneService } from '../phone.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { LangChangeEvent, TranslateService } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-trans',
  templateUrl: './confirm-trans.component.html',
  styleUrls: ['./confirm-trans.component.css'],
  providers: [YnPipe]
})
export class ConfirmTransComponent implements OnInit {

  loading:Boolean=false;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<ConfirmTransComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private phoneService:PhoneService,
    public snackBar: MdSnackBar,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService,
    private router:Router) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  complete(phone:Phone,tocomplete:string){
    this.data.loading=true;
    this.phoneService.confirm_trans(phone).subscribe(res=>{
      this.phoneService.getCountTransPhones().subscribe(response=>{
        this.lsService.setStorage('count_trans_phones',response,99999999999);
      });
      this.phoneService.getPhoneLastOrder(phone.id).subscribe(_res=>{
        this.router.navigate(['/הזמנה/'+_res.id ]);
      })
      this.snackBar.open(phone.phone+'', tocomplete, {
        duration: 2000,
      });
      this.data.loading=false;
    });
  }

  ngOnInit() {
  }

}
