import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { YnPipe } from '../../pipes/yn.pipe';
import { TranslateService, LangChangeEvent } from 'ng2-translate';
import { LocalStorageService } from '../../local-storage.service';
import { AuthenticationService } from '../../login/authentication.service';
import { AgentService } from '../agent.service';

@Component({
  selector: 'app-delete-agreement',
  templateUrl: './delete-agreement.component.html',
  styleUrls: ['./delete-agreement.component.css']
})
export class DeleteAgreementComponent implements OnInit {

  loading:Boolean=false;
  lan:any;
  constructor(
    public dialogRef: MdDialogRef<DeleteAgreementComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private agentService:AgentService,
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
    this.agentService.deleteAgreement(id).subscribe(res=>{
      this.snackBar.open(this.data.row.title, todelete, {
        duration: 2000,
      });
      this.data.loading=false;
    });
  }

  ngOnInit() {
  }

}
