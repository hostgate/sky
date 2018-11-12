import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { PaymentService } from '../payment.service';
import { YnPipe } from '../../pipes/yn.pipe';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css'],
  providers: [YnPipe],
})
export class DeleteComponent implements OnInit {
  loading:Boolean=false;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<DeleteComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private paymentService:PaymentService,
    public snackBar: MdSnackBar,
    private trans:TranslateService,
    private lsService:LocalStorageService,
    public authService:AuthenticationService) {
      this.lan=this.lsService.getStorage('lan');
      this.trans.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lan=event.lang;
      });
    }
  onNoClick(): void {
    this.dialogRef.close();
  }
  delete(id:number,todelete:string){
    this.data.loading=true;
    this.paymentService.delete(id).subscribe(res=>{
      this.snackBar.open(this.data.payment, todelete, {
        duration: 2000,
      });
      this.data.loading=false;
    });
  }

  ngOnInit() {
  }

}
